# Database Query & Indexing Checklist

1. **N+1 Query Elimination**:
   - Use eager loading / batch fetching (`include` in Prisma, `JOIN FETCH`, or DataLoader).
   - Avoid executing queries inside array loops (`map`, `forEach`).

2. **Index Optimization**:
   - Add composite indexes matching the order of composite `WHERE` clauses.
   - Check `EXPLAIN ANALYZE` for sequential scans on large tables (>10k rows).

3. **Connection Pooling**:
   - Configure pool bounds (min/max connections) appropriately for serverless environments.
