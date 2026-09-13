# BigQuery Performance & Cost Optimization

1. **Partitioning**: Always partition tables larger than 1GB by date or timestamp.
2. **Clustering**: Cluster on up to 4 high-cardinality columns used in `WHERE` and `JOIN` filters.
3. **Scan Minimization**: Query cost is directly proportional to bytes scanned. Never use `SELECT *` in production jobs.
