#!/usr/bin/env node
/**
 * Direct Multi-Platform Publisher for The Non-Coder's Agentic Production Handbook
 *
 * Fully native Node.js script — zero external npm dependencies.
 * Direct API control for X Article and Bluesky.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const PUBLISHED_STATE_FILE = path.join(REPO_ROOT, "published_handbook.json");
const BANNER_FILE = path.join(REPO_ROOT, "assets", "banner_handbook.jpg");
const ARTICLE_MD_FILE = path.join(REPO_ROOT, "HANDBOOK.md");

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

export const X_ARTICLE_TITLE = "The Non-Coder's Agentic Production Handbook: 0% Code, 100% Persistence";

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
    num: 1,
    hasMedia: true,
    text: `I have 0 coding qualifications, but my app is live on the Apple App Store and Google Play.

In 8 months, I burned 1.13 billion tokens with AI agents, took on Apple’s Screen Time framework, and conquered 4 App Store rejections.

Tonight, I packaged my entire production playbook: 🧵👇`
  },
  {
    num: 2,
    hasMedia: false,
    text: `Rule 1: Crystal-Clear Intent.

AI agents are world-class executors, but terrible mind readers. If your idea is foggy, the agent will build a bloated hallucination.

Describe the user story out loud at the kitchen table before typing a single prompt. Specify: Input ➔ Mutation ➔ Output.`
  },
  {
    num: 3,
    hasMedia: false,
    text: `Rule 2: Syntax is a Legacy Constraint.

Stop trying to be the compiler. Act as the product architect.

I run a 3-agent harness:
1. The Architect (holds schema and system state)
2. The Builder (isolated atomic UI)
3. The Adversary (runs the compiler and rejects hallucinated syntax before human review)`
  },
  {
    num: 4,
    hasMedia: false,
    text: `Rule 3: The Headless Xcode Loop.

When Apple rejected TickBucks 4 times, I didn't ask the AI "why won't Xcode build?".

I fed the headless xcodebuild compiler logs back into a verification agent with strict file-quarantine rules. Approved on attempt 5.`
  },
  {
    num: 5,
    hasMedia: false,
    text: `What is the one project you've shelved because you "can't code"? A native mobile app, a SaaS backend, or internal tooling?

If a non-coder can pass Apple review on attempt 5, you can ship too. Tell me what you're building below 👇

Full interactive hub & repo:
https://jamescantco.de/handbook`
  }
];

// --- OAUTH 1.0A HELPER ---

function getXCreds() {
  return {
    apiKey: env.JCC_X_API_KEY || env.TWITTER_API_KEY,
    apiSecret: env.JCC_X_API_SECRET || env.TWITTER_API_SECRET,
    accessToken: env.JCC_X_ACCESS_TOKEN || env.TWITTER_ACCESS_TOKEN,
    accessSecret: env.JCC_X_ACCESS_SECRET || env.TWITTER_ACCESS_SECRET
  };
}

function generateOAuth1Header(method, url, creds, queryParams = {}) {
  const oauthParams = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: creds.accessToken,
    oauth_version: "1.0",
    ...queryParams
  };

  const orderedParams = Object.keys(oauthParams)
    .sort()
    .reduce((acc, key) => {
      acc[key] = oauthParams[key];
      return acc;
    }, {});

  const paramString = Object.entries(orderedParams)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const baseUrl = url.split("?")[0];
  const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(creds.apiSecret)}&${encodeURIComponent(creds.accessSecret)}`;

  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBaseString)
    .digest("base64");

  const authHeaderParts = Object.entries(orderedParams)
    .filter(([k]) => k.startsWith("oauth_"))
    .concat([["oauth_signature", signature]])
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`);

  return `OAuth ${authHeaderParts.join(", ")}`;
}

// --- BLUESKY FACET PARSER ---

function extractFacets(text) {
  const facets = [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    const url = match[1];
    const byteStart = Buffer.byteLength(text.slice(0, match.index));
    const byteEnd = byteStart + Buffer.byteLength(url);
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#link", uri: url }]
    });
  }
  const tagRegex = /(?:^|\s)(#[a-zA-Z0-9_]+)/g;
  while ((match = tagRegex.exec(text)) !== null) {
    const rawTag = match[1].trim();
    const tag = rawTag.replace(/^#/, "");
    const offset = match[0].indexOf("#");
    const byteStart = Buffer.byteLength(text.slice(0, match.index + offset));
    const byteEnd = byteStart + Buffer.byteLength(rawTag);
    facets.push({
      index: { byteStart, byteEnd },
      features: [{ $type: "app.bsky.richtext.facet#tag", tag }]
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
  form.append("media", blob, "banner_handbook.jpg");
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
            alt: "The Non-Coder Production Handbook - James Can't Code",
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

// --- CLI ORCHESTRATION ---

async function main() {
  const args = process.argv.slice(2);
  const isPublish = args.includes("--publish");
  const isCreateDraft = args.includes("--create-draft-x");
  const isDryRun = args.includes("--dry-run");

  const draftIdArg = args.find((a) => a.startsWith("--draft-id="));
  const draftIdIdx = args.indexOf("--draft-id");
  const specifiedDraftId = draftIdArg ? draftIdArg.split("=")[1] : (draftIdIdx !== -1 ? args[draftIdIdx + 1] : null);

  console.log("======================================================");
  console.log("  🚀 JCC ARTICLE 6: THE NON-CODER PRODUCTION HANDBOOK");
  console.log("======================================================");

  if (isDryRun) {
    console.log("\n✨ DRY RUN COMPLETE.");
    console.log("• To stage the Article draft directly in your X dashboard: --create-draft-x");
    console.log("• To publish live on both X and Bluesky: --publish");
    return;
  }

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

    console.log("4. Posting first reply with bookmark checklist and links...");
    const replyText = `🔖 The Non-Coder Production Stack Cheat Sheet:

1. Intent > Syntax: Act as product architect, not the compiler
2. 3-Agent Harness: Architect (schema) + Builder (code) + Adversary (compiler)
3. Headless Xcode: Debug native builds via CLI logs, not Xcode UI

Full handbook & templates:
https://jamescantco.de/handbook`;
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
