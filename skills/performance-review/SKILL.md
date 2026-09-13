---
name: performance-review
description: Full-stack performance review covering Core Web Vitals (LCP/CLS), React re-rendering, database queries, and latency optimization. Triggers on 'performance review', 'speed audit', 'profile this', or 'optimize latency'.
---

# Performance Review Protocol (SuperSkill)

This SuperSkill executes structured performance profiling across frontend rendering, build bundles, backend latency, and database query throughput.

## Operational Modes
- **Quick Scan**: Targeted audit of a specific React component, SQL query, or API endpoint.
- **Full Audit**: End-to-end performance profile covering Core Web Vitals, bundle analysis, and connection pooling.

## Execution Phases & Progressive Disclosure

### Phase 1: Frontend & Core Web Vitals (LCP, CLS, INP)
> *Load reference module for web frontend profiling*:
> Read [`references/web-vitals.md`](references/web-vitals.md)
- Measure Largest Contentful Paint (LCP) candidates (hero images, web fonts).
- Audit Cumulative Layout Shift (CLS) from un-dimensioned media or dynamic embeds.
- Check Interaction to Next Paint (INP) bottlenecks on main-thread scripting.

### Phase 2: React & Next.js Render Optimization
> *Load reference module for component & bundle audits*:
> Read [`references/react-profiling.md`](references/react-profiling.md)
- Identify unnecessary parent re-renders and cascading component updates.
- Verify server/client boundaries; ensure heavy libraries remain on the server.
- Audit bundle chunking, dynamic imports (`next/dynamic`), and image optimization.

### Phase 3: Database Query Latency & Indexing
> *Load reference module for database & cache profiling*:
> Read [`references/database-queries.md`](references/database-queries.md)
- Identify N+1 query patterns across ORM relationships.
- Audit missing indexes on frequent `WHERE`, `JOIN`, and `ORDER BY` columns.
- Review connection pooling configurations and query timeouts.

### Phase 4: Low-Latency Streaming & Cache Tuning
> *Load reference module for real-time systems*:
> Read [`references/latency-critical.md`](references/latency-critical.md)
- Redis caching strategies and stale-while-revalidate patterns.
- WebSocket / SSE streaming backpressure and serialization overhead.

## Output Format
Present findings with quantified metrics:
`| Area | Current Baseline | Bottleneck | Target Metric | Deterministic Fix |`
