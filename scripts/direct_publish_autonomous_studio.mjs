#!/usr/bin/env node
/**
 * Direct Multi-Platform Publisher for Article 2: SuperSkills & Progressive Disclosure
 *
 * Fully native Node.js script — zero external npm dependencies.
 * Bypasses OmniSocials completely for 100% direct API control.
 *
 * Features:
 *   - X Article: Full long-form essay from AUTONOMOUS_STUDIO.md + banner_autonomous_studio.jpg
 *   - Bluesky: 5-post native thread + banner embed + clickable link facets
 *   - Idempotency: Guards against accidental double-posting via published_superskills.json
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PUBLISHED_STATE_FILE = path.join(REPO_ROOT, "published_autonomous_studio.json");
const BANNER_FILE = path.join(REPO_ROOT, "assets", "banner_autonomous_studio.jpg");
const ARTICLE_MD_FILE = path.join(REPO_ROOT, "AUTONOMOUS_STUDIO.md");

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

// --- ARTICLE CONFIGURATION (X) ---

export const X_ARTICLE_TITLE = "The Autonomous Studio: Running Multi-Agent Swarms, Automated Video, and Continuous Distribution";

export function parseMarkdownToBlocks() {
  const content = fs.readFileSync(ARTICLE_MD_FILE, "utf-8");
  const lines = content.split("\n");
  const blocks = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "---") continue;

    if (line.startsWith("### ")) {
      blocks.push({ type: "header-two", text: line.replace("### ", "").trim() });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "header-one", text: line.replace("## ", "").trim() });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "header-one", text: line.replace("# ", "").trim() });
    } else if (line.startsWith("* ") || line.startsWith("- ")) {
      blocks.push({ type: "unordered-list-item", text: line.replace(/^[\*\-]\s+/, "").trim() });
    } else if (/^\d+\.\s+/.test(line)) {
      blocks.push({ type: "ordered-list-item", text: line.replace(/^\d+\.\s+/, "").trim() });
    } else if (line.startsWith("> ")) {
      blocks.push({ type: "blockquote", text: line.replace(/^>\s+/, "").trim() });
    } else {
      blocks.push({ type: "unstyled", text: line });
    }
  }
  return { blocks, rawContent: content };
}

// --- BLUESKY THREAD DEFINITIONS ---

export const BSKY_THREAD = [
  {
    "num": 1,
    "hasMedia": true,
    "text": "Most builders treat AI agents like a faster Stack Overflow: you prompt, you wait, you copy-paste.\n\nIn stage 3, you stop chatting with one assistant. You operate an Autonomous Studio.\n\nHere is how we run multi-agent swarms, programmatic video, and syndication as a 1-person software company \ud83e\uddf5\ud83d\udc47"
  },
  {
    "num": 2,
    "hasMedia": false,
    "text": "Pillar 1: Parallel Git Worktrees via DevFleet.\n\nRunning agents in serial locks your terminal.\n\nUsing agent-orchestration, the system spins up isolated Git worktrees. Agent A builds auth while Agent B tunes database queries. 3x throughput with zero branch collisions."
  },
  {
    "num": 3,
    "hasMedia": false,
    "text": "Pillar 2: The 4-Voice Decision Council.\n\nA passive agent that agrees with bad architecture is dangerous.\n\nWhenever we face an ambiguous choice, we convene the Council: Architect, Pragmatist, Adversary, Operator. A 360-degree debate before writing a single line of code."
  },
  {
    "num": 4,
    "hasMedia": false,
    "text": "Pillars 3 & 4: Programmatic Video & Direct APIs.\n\n\u2022 programmatic-video: Renders 9:16 vertical reels using Remotion (React components) & FFmpeg.\n\u2022 social-content-engine: Formats and stages drafts directly across X and Bluesky APIs with automated launchd schedules."
  },
  {
    "num": 5,
    "hasMedia": false,
    "text": "The future of software isn't typing 50 prompts an hour. It's building systems that operate with genuine velocity.\n\nAll orchestration patterns, Remotion templates, and API scripts are open-source:\nhttps://github.com/jamescantco-de/superskills"
  }
];

// --- OAUTH 1.0A HELPERS FOR X ---

function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function generateOAuth1Header(method, url, creds, extraParams = {}) {
  const oauthParams = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
    ...extraParams
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join("&");

  const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(paramString)}`;
  const signingKey = `${percentEncode(creds.apiSecret)}&${percentEncode(creds.accessSecret)}`;
  const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");

  oauthParams.oauth_signature = signature;
  return "OAuth " + Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");
}

function getXCreds() {
  return {
    apiKey: env.JCC_X_API_KEY,
    apiSecret: env.JCC_X_API_SECRET,
    accessToken: env.JCC_X_ACCESS_TOKEN,
    accessSecret: env.JCC_X_ACCESS_SECRET
  };
}

// --- BLUESKY AT PROTOCOL HELPERS ---

function extractFacets(text) {
  const facets = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[0];
    const utf8Index = Buffer.byteLength(text.slice(0, match.index));
    const utf8End = utf8Index + Buffer.byteLength(url);
    facets.push({
      index: {
        byteStart: utf8Index,
        byteEnd: utf8End
      },
      features: [
        {
          $type: "app.bsky.richtext.facet#link",
          uri: url
        }
      ]
    });
  }
  return facets.length > 0 ? facets : undefined;
}

// --- AUTHENTICATION VERIFICATION ---

async function verifyXAuth() {
  const creds = getXCreds();
  const url = "https://api.twitter.com/2/users/me";
  const authHeader = generateOAuth1Header("GET", url, creds);
  const res = await fetch(url, { headers: { Authorization: authHeader } });
  const data = await res.json();
  if (res.ok && data.data?.id) {
    return { success: true, user: data.data };
  }
  return { success: false, error: data };
}

async function verifyBskyAuth() {
  const res = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: env.BSKY_IDENTIFIER || env.BLUESKY_IDENTIFIER,
      password: env.BSKY_APP_PASSWORD || env.BLUESKY_APP_PASSWORD
    })
  });
  const data = await res.json();
  if (res.ok && data.accessJwt) {
    return { success: true, session: data };
  }
  return { success: false, error: data };
}

// --- MEDIA UPLOADS ---

async function uploadBannerToX() {
  const creds = getXCreds();
  const fileBytes = fs.readFileSync(BANNER_FILE);
  const blob = new Blob([fileBytes], { type: "image/jpeg" });
  const form = new FormData();
  form.append("media", blob, "banner_autonomous_studio.jpg");
  form.append("media_category", "tweet_image");

  const url = "https://upload.twitter.com/1.1/media/upload.json";
  const authHeader = generateOAuth1Header("POST", url, creds);

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: form
  });

  const data = await res.json();
  if (res.ok && data.media_id_string) {
    return data.media_id_string;
  }
  throw new Error(`X Media Upload Failed: ${JSON.stringify(data)}`);
}

async function uploadBannerToBsky(session) {
  const fileBytes = fs.readFileSync(BANNER_FILE);

  const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.uploadBlob", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      "Content-Type": "image/jpeg"
    },
    body: fileBytes
  });

  const data = await res.json();
  if (res.ok && data.blob) {
    return data.blob;
  }
  throw new Error(`Bluesky Media Upload Failed: ${JSON.stringify(data)}`);
}

// --- X ARTICLE CREATION & PUBLISHING ---

async function createXArticleDraft(mediaId) {
  const creds = getXCreds();
  const { blocks } = parseMarkdownToBlocks();

  const payload = {
    title: X_ARTICLE_TITLE,
    content_state: {
      blocks,
      entities: []
    }
  };

  if (mediaId) {
    payload.cover_media = {
      media_id: mediaId,
      media_category: "tweet_image"
    };
  }

  const url = "https://api.twitter.com/2/articles/draft";
  const authHeader = generateOAuth1Header("POST", url, creds);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok && data.data?.id) {
    return data.data;
  }
  throw new Error(`Failed to create X Article draft: ${JSON.stringify(data)}`);
}

async function publishXArticle(articleId) {
  const creds = getXCreds();
  const url = `https://api.twitter.com/2/articles/${articleId}/publish`;
  const authHeader = generateOAuth1Header("POST", url, creds);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  if (res.ok && data.data?.post_id) {
    return data.data;
  }
  throw new Error(`Failed to publish X Article ${articleId}: ${JSON.stringify(data)}`);
}

async function postReplyToPost(postId, replyText) {
  const creds = getXCreds();
  const url = "https://api.twitter.com/2/tweets";
  const authHeader = generateOAuth1Header("POST", url, creds);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: replyText,
      reply: { in_reply_to_tweet_id: postId }
    })
  });

  const data = await res.json();
  if (res.ok && data.data?.id) {
    return data.data;
  }
  console.warn("⚠️ Warning: Could not post reply to article tweet:", data);
  return null;
}

// --- BLUESKY THREAD PUBLISHING ---

async function publishBskyThread(session, blob) {
  const postedSkeets = [];
  let rootRecord = null;
  let parentRecord = null;

  for (const item of BSKY_THREAD) {
    const record = {
      $type: "app.bsky.feed.post",
      text: item.text,
      createdAt: new Date().toISOString()
    };

    const facets = extractFacets(item.text);
    if (facets) {
      record.facets = facets;
    }

    if (item.hasMedia && blob) {
      record.embed = {
        $type: "app.bsky.embed.images",
        images: [
          {
            alt: "SuperSkills & Progressive Disclosure - James Can't Code",
            image: blob
          }
        ]
      };
    }

    if (rootRecord && parentRecord) {
      record.reply = {
        root: { uri: rootRecord.uri, cid: rootRecord.cid },
        parent: { uri: parentRecord.uri, cid: parentRecord.cid }
      };
    }

    const res = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessJwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record
      })
    });

    const data = await res.json();
    if (!res.ok || !data.uri) {
      throw new Error(`Failed to post Bluesky Post ${item.num}: ${JSON.stringify(data)}`);
    }

    const postInfo = { uri: data.uri, cid: data.cid };
    if (!rootRecord) rootRecord = postInfo;
    parentRecord = postInfo;

    const rkey = data.uri.split("/").pop();
    const postUrl = `https://bsky.app/profile/${session.handle}/post/${rkey}`;
    postedSkeets.push({ num: item.num, uri: data.uri, url: postUrl });
    console.log(`✅ Bluesky Post ${item.num}/5 posted: ${postUrl}`);

    await new Promise((r) => setTimeout(r, 1500));
  }

  return postedSkeets;
}

// --- VOICE & CONSTRAINT AUDIT ---

const BANNED_WORDS = [
  "delve", "seamless", "cutting-edge", "synergy", "tapestry", "myriad",
  "plethora", "embark", "foster", "holistic", "paradigm", "transformative",
  "underscore", "elevate", "harness", "unlock", "best-in-class", "world-class",
  "actionable", "in conclusion", "in summary", "navigate the landscape", "move the needle",
  "leverage"
];

function auditAll() {
  console.log(`\n======================================================`);
  console.log(`  AUDITING: X ARTICLE (AUTONOMOUS_STUDIO.md)`);
  console.log(`======================================================`);
  const { blocks, rawContent } = parseMarkdownToBlocks();
  const wordCount = rawContent.split(/\s+/).filter(Boolean).length;
  const charCount = rawContent.length;
  const bannedInArticle = BANNED_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(rawContent));

  console.log(`Title:       ${X_ARTICLE_TITLE}`);
  console.log(`Cover:       assets/banner_autonomous_studio.jpg`);
  console.log(`Format:      X Premium Long-Form Article (${blocks.length} blocks)`);
  console.log(`Length:      ${wordCount.toLocaleString()} words · ${charCount.toLocaleString()} characters`);
  console.log(`Banned Words:${bannedInArticle.length === 0 ? " ✅ 0 found" : " ❌ " + bannedInArticle.join(", ")}`);

  console.log(`\n======================================================`);
  console.log(`  AUDITING: BLUESKY THREAD (Max 300 chars per post)`);
  console.log(`======================================================`);
  let bskyError = false;

  BSKY_THREAD.forEach((item) => {
    const len = item.text.length;
    const isOver = len > 300;
    const foundBanned = BANNED_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(item.text));

    console.log(`\n[Post ${item.num}/5] (${len}/300 chars) ${isOver ? "❌ OVER LIMIT" : "✅ OK"}`);
    if (item.hasMedia) console.log(`   [Attached Media: assets/banner_autonomous_studio.jpg]`);
    console.log(`---`);
    console.log(item.text);
    console.log(`---`);

    if (isOver || foundBanned.length > 0) bskyError = true;
  });

  return bannedInArticle.length === 0 && !bskyError;
}

// --- MAIN CLI DISPATCH ---

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const isVerifyAuth = args.includes("--verify-auth");
  const isCreateDraft = args.includes("--create-draft-x");
  const isPublish = args.includes("--publish");
  const isForce = args.includes("--force");

  const draftIdIdx = args.indexOf("--draft-id");
  const specifiedDraftId = draftIdIdx !== -1 ? args[draftIdIdx + 1] : null;

  if (!isDryRun && !isVerifyAuth && !isCreateDraft && !isPublish) {
    console.log("Usage: node scripts/direct_publish_superskills.mjs [--dry-run | --verify-auth | --create-draft-x | --publish] [--force]");
    process.exit(0);
  }

  // Idempotency Check
  if (isPublish && fs.existsSync(PUBLISHED_STATE_FILE) && !isForce) {
    const existing = JSON.parse(fs.readFileSync(PUBLISHED_STATE_FILE, "utf-8"));
    console.log(`\n⚠️  ALREADY PUBLISHED on ${existing.publishedAt}`);
    console.log(`• X Article:      ${existing.x?.url}`);
    console.log(`• Bluesky Thread: ${existing.bluesky?.rootUrl}`);
    console.log(`Use --force if you intentionally wish to republish.`);
    process.exit(0);
  }

  const isValid = auditAll();
  if (!isValid) {
    console.error("\n❌ Audit failed. Please resolve errors.");
    process.exit(1);
  }
  console.log("\n✅ All voice and format audits passed successfully!");

  // Auth Verification
  if (isVerifyAuth || isCreateDraft || isPublish) {
    console.log("\n--- Checking Authentication ---");
    const [xAuth, bskyAuth] = await Promise.all([verifyXAuth(), verifyBskyAuth()]);

    if (!xAuth.success) {
      console.error("❌ X Auth Failed:", xAuth.error);
      process.exit(1);
    }
    console.log(`✅ X Auth: @${xAuth.user.username} (ID: ${xAuth.user.id})`);

    if (!bskyAuth.success) {
      console.warn("⚠️ Bluesky Auth Warning:", bskyAuth.error);
      if (!isPublish && !isCreateDraft) {
        console.warn("   (Bluesky credentials invalid or unverified)");
      }
    } else {
      console.log(`✅ Bluesky Auth: ${bskyAuth.session.handle} (DID: ${bskyAuth.session.did})`);
    }

    if (isVerifyAuth) {
      console.log("\n🚀 All connections checked.");
      return;
    }
  }

  // Dry Run
  if (isDryRun) {
    console.log("\n✨ DRY RUN COMPLETE.");
    console.log("• To stage the Article draft directly in your X dashboard, run with: --create-draft-x");
    console.log("• To publish live on both X and Bluesky, run with: --publish");
    return;
  }

  // Create Draft on X
  if (isCreateDraft) {
    console.log("\n🚀 Uploading cover banner to X...");
    const mediaId = await uploadBannerToX();
    console.log("   Banner uploaded. Media ID:", mediaId);

    console.log("🚀 Creating Article draft on X (@jamescantcode)...");
    const draft = await createXArticleDraft(mediaId);
    console.log(`\n🎉 Article Draft created on X!`);
    console.log(`• Draft ID:   ${draft.id}`);
    console.log(`• Title:      ${draft.title}`);
    console.log(`• Status:     Saved in your X Articles Drafts (https://x.com/articles)`);
    return draft;
  }

  // Live Publish
  if (isPublish) {
    console.log("\n🚨 STARTING FULL LAUNCH (X ARTICLE + BLUESKY THREAD)...");

    let articleId = specifiedDraftId;
    let publishedArticle = null;

    if (articleId) {
      console.log(`\n1. Attempting to publish using existing staged Article Draft ID: ${articleId}`);
      try {
        publishedArticle = await publishXArticle(articleId);
      } catch (err) {
        console.warn(`⚠️ Staged Draft ID ${articleId} could not be published (${err.message}). Falling back to fresh draft creation...`);
        articleId = null;
      }
    }

    if (!articleId || !publishedArticle) {
      console.log("\n1. Uploading cover banner to X...");
      const xMediaId = await uploadBannerToX();
      console.log("   Banner uploaded to X. Media ID:", xMediaId);

      console.log("2. Creating fresh Article draft on X...");
      const draft = await createXArticleDraft(xMediaId);
      articleId = draft.id;
      console.log(`   Draft created. Draft ID: ${articleId}`);

      console.log("3. Publishing X Article publicly...");
      publishedArticle = await publishXArticle(articleId);
    }

    const postUrl = `https://x.com/jamescantcode/status/${publishedArticle.post_id}`;
    console.log(`   🎉 X Article Published! Post URL: ${postUrl}`);

    console.log("4. Posting first reply with GitHub link...");
    const replyText = `All 12 SuperSkills including agent-orchestration, programmatic-video, and social-content-engine are open-source on GitHub:\nhttps://github.com/jamescantco-de/superskills\n\nAnd for the foundational multi-agent setup, grab the Agent Starter Kit:\nhttps://github.com/jamescantco-de/agent-starter-kit`;
    const replyTweet = await postReplyToPost(publishedArticle.post_id, replyText);
    if (replyTweet) console.log(`   First reply posted: https://x.com/jamescantcode/status/${replyTweet.id}`);

    // Bluesky Thread
    let bskyPosts = [];
    try {
      console.log("\n5. Authenticating with Bluesky...");
      const bskyAuthRes = await verifyBskyAuth();
      if (bskyAuthRes.success) {
        const bskySession = bskyAuthRes.session;
        console.log("6. Uploading banner to Bluesky...");
        const bskyBlob = await uploadBannerToBsky(bskySession);
        console.log("   Banner uploaded to Bluesky. Blob CID:", bskyBlob.ref.$link);

        console.log("7. Publishing Bluesky 5-Post Thread...");
        bskyPosts = await publishBskyThread(bskySession, bskyBlob);
      } else {
        console.warn("⚠️ Bluesky syndication skipped due to auth issue:", bskyAuthRes.error);
      }
    } catch (bskyErr) {
      console.warn("⚠️ Bluesky publishing failed:", bskyErr.message || bskyErr);
    }

    const publishRecord = {
      publishedAt: new Date().toISOString(),
      x: {
        articleId,
        postId: publishedArticle.post_id,
        url: postUrl,
        replyPostId: replyTweet?.id || null
      },
      bluesky: bskyPosts.length > 0 ? {
        rootUri: bskyPosts[0].uri,
        rootUrl: bskyPosts[0].url,
        postsCount: bskyPosts.length
      } : { status: "skipped_or_failed" }
    };

    fs.writeFileSync(PUBLISHED_STATE_FILE, JSON.stringify(publishRecord, null, 2));

    console.log("\n======================================================");
    console.log("🎉 LAUNCH COMPLETED SUCCESSFULLY!");
    console.log(`• X Article Post:      ${postUrl}`);
    if (bskyPosts.length > 0) {
      console.log(`• Bluesky Thread Root: ${bskyPosts[0].url}`);
    }
    console.log(`• Recorded to:         ${path.basename(PUBLISHED_STATE_FILE)}`);
    console.log("======================================================");
  }
}

main().catch((err) => {
  console.error("\n❌ Fatal Error:", err.message || err);
  process.exit(1);
});
