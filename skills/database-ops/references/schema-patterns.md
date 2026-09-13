# Database Schema Design Standards

1. **Primary Keys**: Use UUIDv7 (time-ordered) or BigInt auto-increment.
2. **Timestamps**: Always include `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at`.
3. **Soft Deletes vs Hard Deletes**: Prefer status state machines or explicit `deleted_at` timestamps for critical user data.
