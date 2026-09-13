# Direct API Staging & Double-Post Protection

1. **OAuth 1.0a (X)**: Generate HMAC-SHA1 signature for X API v2 endpoints.
2. **ATProto (Bluesky)**: Authenticate via `com.atproto.server.createSession` and post to `app.bsky.feed.post`.
3. **Idempotency**: Always record published post IDs into a local `published.json` to prevent double-posting.
