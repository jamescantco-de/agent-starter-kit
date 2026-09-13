# DevFleet & Git Worktree Isolation

1. **Worktree Setup**:
   ```bash
   git worktree add ../feature-branch -b feature-branch
   ```
2. **Parallel Agent Boundaries**:
   - Each subagent operates strictly within its designated worktree directory.
   - Shared dependencies (e.g. database schema) must be locked prior to dispatch.
