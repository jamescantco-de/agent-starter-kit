# Low-Latency & Streaming Patterns

1. **Caching Architecture**:
   - Use Redis with atomic TTLs; implement stale-while-revalidate for read-heavy feeds.
   - Prevent cache stampedes using distributed locks or probabilistic early expiration.

2. **Streaming & Serialization**:
   - Stream large payloads via HTTP chunked transfer or SSE instead of buffering in memory.
   - Optimize JSON serialization; pre-compile schemas with fast-json-stringify where microsecond latency counts.
