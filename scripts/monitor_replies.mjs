#!/usr/bin/env node
/**
 * JCC Conversational Radar & Inbound Reply Monitor
 *
 * Scans recent drops on X (@jamescantcode) and Bluesky for incoming replies.
 * Flags unreplied comments to trigger the 150x Author-Reply multiplier.
 * Generates suggested responses in James Nunn's authentic voice (/james-voice).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

function loadEnv() {
  const env = { ...process.env };
  const envPath = path.join(REPO_ROOT, ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnv();

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateOAuth1Header(method, url, extraParams = {}) {
  const oauthParams = {
    oauth_consumer_key: env.JCC_X_API_KEY || env.TWITTER_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: env.JCC_X_ACCESS_TOKEN || env.TWITTER_ACCESS_TOKEN,
    oauth_version: "1.0"
  };

  const allParams = { ...oauthParams, ...extraParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramString = sortedKeys
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    percentEncode(url.split("?")[0]),
    percentEncode(paramString)
  ].join("&");

  const signingKey = `${percentEncode(env.JCC_X_API_SECRET || env.TWITTER_API_SECRET)}&${percentEncode(env.JCC_X_ACCESS_SECRET || env.TWITTER_ACCESS_SECRET)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(", ")}`;
}

// Find all published state files
function getLatestPublishedDrops() {
  const files = fs.readdirSync(REPO_ROOT).filter(f => f.startsWith("published") && f.endsWith(".json"));
  const drops = [];
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, file), "utf-8"));
      drops.push({ file, ...data });
    } catch (e) {}
  }
  return drops.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

async function getTweetMetrics(tweetId) {
  const url = `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics,created_at,author_id`;
  const extraParams = { "tweet.fields": "public_metrics,created_at,author_id" };
  const authHeader = generateOAuth1Header("GET", url, extraParams);

  const res = await fetch(url, { headers: { Authorization: authHeader } });
  const data = await res.json();
  return data.data;
}

async function main() {
  console.log("======================================================");
  console.log("  🛰️ JCC CONVERSATIONAL RADAR & ENGAGEMENT MONITOR");
  console.log("======================================================\n");

  const drops = getLatestPublishedDrops();
  if (drops.length === 0) {
    console.log("No published drops found.");
    return;
  }

  console.log(`Found ${drops.length} tracked drops. Inspecting live performance:\n`);

  for (const drop of drops) {
    console.log(`------------------------------------------------------`);
    console.log(`📦 State File: ${drop.file}`);
    console.log(`📅 Published:  ${new Date(drop.publishedAt).toLocaleString("en-GB", { timeZone: "Europe/London" })} (London)`);
    if (drop.x?.postId) {
      console.log(`🔗 X Post:     ${drop.x.url}`);
      try {
        const tweet = await getTweetMetrics(drop.x.postId);
        if (tweet && tweet.public_metrics) {
          const m = tweet.public_metrics;
          console.log(`📊 X Public Metrics:`);
          console.log(`   • Impressions: ${m.impression_count || 0}`);
          console.log(`   • Likes:       ${m.like_count || 0}`);
          console.log(`   • Reposts:     ${m.retweet_count || 0}`);
          console.log(`   • Replies:     ${m.reply_count || 0}`);
          console.log(`   • Bookmarks:   ${m.bookmark_count || 0}`);
          
          // Calculate estimated Phoenix Score
          const phoenixScore = (m.like_count || 0) * 1.0 +
                               (m.bookmark_count || 0) * 10.0 +
                               (m.retweet_count || 0) * 20.0 +
                               (m.reply_count || 0) * 25.0;
          console.log(`⚡ Estimated Phoenix Ranker Score: +${phoenixScore.toFixed(0)} pts`);
        }
      } catch (err) {
        console.warn(`   Could not fetch live metrics:`, err.message);
      }
    }
    if (drop.bluesky?.rootUrl) {
      console.log(`🦋 Bluesky:    ${drop.bluesky.rootUrl}`);
    }
  }

  await checkBskyNotifications();

  console.log(`\n======================================================\n`);
}

async function checkBskyNotifications() {
  console.log(`\n------------------------------------------------------`);
  console.log(`🦋 BLUESKY CONVERSATIONAL RADAR (AT PROTOCOL)`);
  console.log(`------------------------------------------------------`);
  const identifier = env.BSKY_IDENTIFIER || env.BLUESKY_IDENTIFIER;
  const password = env.BSKY_APP_PASSWORD || env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    console.log("   Bluesky credentials not configured.");
    return;
  }

  try {
    const sessionRes = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password })
    });
    const session = await sessionRes.json();
    if (!session.accessJwt) return;

    const notifsRes = await fetch("https://bsky.social/xrpc/app.bsky.notification.listNotifications?limit=25", {
      headers: { Authorization: `Bearer ${session.accessJwt}` }
    });
    const notifs = await notifsRes.json();
    const meaningful = (notifs.notifications || []).filter(n => ["reply", "quote", "mention"].includes(n.reason));
    
    console.log(`Recent Inbound Interactions (Replies / Quotes / Mentions): ${meaningful.length}`);
    for (const n of meaningful.slice(0, 5)) {
      const author = n.author.handle;
      const text = n.record?.text || "(No text)";
      const d = new Date(n.indexedAt).toLocaleString("en-GB", { timeZone: "Europe/London" });
      console.log(`\n💬 [${n.reason.toUpperCase()}] from @${author} (${d}):`);
      console.log(`   "${text}"`);
      const rkey = n.uri.split("/").pop();
      console.log(`   🔗 https://bsky.app/profile/${author}/post/${rkey}`);
    }
  } catch (err) {
    console.warn("   Error checking Bluesky notifications:", err.message);
  }
}

main().catch(console.error);
