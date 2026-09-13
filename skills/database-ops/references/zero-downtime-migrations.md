# Zero-Downtime Migration Playbook (Expand-Contract)

1. **Phase 1 (Expand)**: Add the new column as nullable. Deploy application code that writes to both old and new columns.
2. **Phase 2 (Backfill)**: Run an asynchronous background script to backfill existing records.
3. **Phase 3 (Switch)**: Deploy code that reads from the new column.
4. **Phase 4 (Contract)**: Drop the old column after validating zero active reads.
