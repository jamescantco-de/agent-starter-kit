---
name: database-ops
description: Relational and analytical database architecture, zero-downtime migrations, schema indexing, and ORM query optimization. Triggers on 'database design', 'migration plan', 'optimize queries', or 'schema changes'.
---

# Database Operations Protocol (SuperSkill)

This SuperSkill guides schema design, zero-downtime migration plans, indexing strategies, and ORM performance tuning across PostgreSQL, MySQL, and ClickHouse.

## Execution Phases & Progressive Disclosure

### Phase 1: Schema Architecture & Data Modelling
> *Load reference module for relational schema design*:
> Read [`references/schema-patterns.md`](references/schema-patterns.md)
- Design normalized entity relationships with clear foreign keys and constraints.
- Define appropriate data types (UUID vs BigInt, Timestamp with time zone).

### Phase 2: Indexing & Query Optimization
> *Load reference module for indexing strategies*:
> Read [`references/indexing-guide.md`](references/indexing-guide.md)
- Audit B-Tree, GIN, and composite indexes.
- Index foreign key columns to avoid full table scans on `JOIN` and `CASCADE`.

### Phase 3: Zero-Downtime Migration Planning
> *Load reference module for safe production migrations*:
> Read [`references/zero-downtime-migrations.md`](references/zero-downtime-migrations.md)
- Follow the Expand-Contract pattern for renaming/moving columns.
- Add columns as nullable first; backfill data asynchronously; enforce constraints last.
- Create indexes concurrently (`CREATE INDEX CONCURRENTLY`) in PostgreSQL.

## Output Format
Deliver SQL DDL or Prisma schemas accompanied by a step-by-step zero-downtime rollout and rollback plan.
