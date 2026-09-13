# Indexing Best Practices

1. **Foreign Keys**: Always index foreign key columns (`user_id`, `organization_id`).
2. **Composite Indexes**: Place high-cardinality equality filter columns first, followed by range/order columns.
3. **Partial Indexes**: Use partial indexes (`WHERE active = true`) to index high-traffic active records while keeping index size minimal.
