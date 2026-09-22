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
    oauth_consumer_key: env.JCC_X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: env.JCC_X_ACCESS_TOKEN,
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

  const signingKey = `${percentEncode(env.JCC_X_API_SECRET)}&${percentEncode(env.JCC_X_ACCESS_SECRET)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`);

  return `OAuth ${headerParts.join(", ")}`;
}

async function fetchUserTweets() {
  const userId = "2003354842123972609";
  const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=100&tweet.fields=created_at,public_metrics,conversation_id,in_reply_to_user_id`;
  const extraParams = {
    max_results: "100",
    "tweet.fields": "created_at,public_metrics,conversation_id,in_reply_to_user_id"
  };
  const authHeader = generateOAuth1Header("GET", url, extraParams);

  const res = await fetch(url, {
    headers: { Authorization: authHeader }
  });

  const data = await res.json();
  return data;
}

async function main() {
  console.log("Fetching tweets and engagement metrics for @jamescantcode...");
  const result = await fetchUserTweets();
  if (result.errors) {
    console.error("API Errors:", result.errors);
  }
  if (!result.data || result.data.length === 0) {
    console.log("No tweets found or response:", result);
    return;
  }

  console.log(`Found ${result.data.length} tweets.\n`);
  const analysis = result.data.map(t => {
    const d = new Date(t.created_at);
    // Convert to London time
    const londonTimeStr = d.toLocaleString("en-GB", { timeZone: "Europe/London", hour12: false });
    const hour = parseInt(d.toLocaleString("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false }));
    const day = d.toLocaleString("en-GB", { timeZone: "Europe/London", weekday: "short" });
    const m = t.public_metrics || {};
    const totalEngagement = (m.like_count || 0) + (m.retweet_count || 0) * 20 + (m.reply_count || 0) * 15 + (m.bookmark_count || 0) * 10;
    return {
      id: t.id,
      text: t.text.replace(/\n/g, " ").slice(0, 80),
      createdAt: t.created_at,
      londonTime: londonTimeStr,
      day,
      hour,
      metrics: m,
      totalEngagement
    };
  });

  console.table(analysis.map(a => ({
    time: a.londonTime,
    day: a.day,
    hour: a.hour,
    likes: a.metrics.like_count,
    rts: a.metrics.retweet_count,
    replies: a.metrics.reply_count,
    bookmarks: a.metrics.bookmark_count,
    impressions: a.metrics.impression_count,
    snippet: a.text
  })));

  // Group by hour
  const hourMap = {};
  for (const a of analysis) {
    if (!hourMap[a.hour]) hourMap[a.hour] = { count: 0, impressions: 0, likes: 0, rts: 0, replies: 0, bookmarks: 0 };
    hourMap[a.hour].count++;
    hourMap[a.hour].impressions += (a.metrics.impression_count || 0);
    hourMap[a.hour].likes += (a.metrics.like_count || 0);
    hourMap[a.hour].rts += (a.metrics.retweet_count || 0);
    hourMap[a.hour].replies += (a.metrics.reply_count || 0);
    hourMap[a.hour].bookmarks += (a.metrics.bookmark_count || 0);
  }

  console.log("\n--- Hourly Engagement Breakdown (Europe/London) ---");
  console.table(hourMap);

  // Group by day of week
  const dayMap = {};
  for (const a of analysis) {
    if (!dayMap[a.day]) dayMap[a.day] = { count: 0, impressions: 0, likes: 0, rts: 0, replies: 0, bookmarks: 0 };
    dayMap[a.day].count++;
    dayMap[a.day].impressions += (a.metrics.impression_count || 0);
    dayMap[a.day].likes += (a.metrics.like_count || 0);
    dayMap[a.day].rts += (a.metrics.retweet_count || 0);
    dayMap[a.day].replies += (a.metrics.reply_count || 0);
    dayMap[a.day].bookmarks += (a.metrics.bookmark_count || 0);
  }

  // Print top 10 by impressions
  console.log("\n--- Top 10 Tweets by Impressions ---");
  const topImpressions = [...analysis].sort((a, b) => (b.metrics.impression_count || 0) - (a.metrics.impression_count || 0)).slice(0, 10);
  console.table(topImpressions.map(a => ({
    time: a.londonTime,
    day: a.day,
    impressions: a.metrics.impression_count,
    likes: a.metrics.like_count,
    replies: a.metrics.reply_count,
    rts: a.metrics.retweet_count,
    bookmarks: a.metrics.bookmark_count,
    text: a.text
  })));

  // Print top 10 by replies / engagement
  console.log("\n--- Top 10 Tweets by Replies (Conversational) ---");
  const topReplies = [...analysis].sort((a, b) => (b.metrics.reply_count || 0) - (a.metrics.reply_count || 0)).slice(0, 10);
  console.table(topReplies.map(a => ({
    time: a.londonTime,
    day: a.day,
    replies: a.metrics.reply_count,
    likes: a.metrics.like_count,
    impressions: a.metrics.impression_count,
    text: a.text
  })));
}

main().catch(console.error);
