# Automated Data Quality Standards

1. **Deduplication**: Use `QUALIFY ROW_NUMBER() OVER(PARTITION BY id ORDER BY updated_at DESC) = 1`.
2. **Null Safety**: Coalesce nullable strings to empty strings or default fallback tokens.
3. **Validation Contracts**: Verify schema invariants before appending to analytical tables.
