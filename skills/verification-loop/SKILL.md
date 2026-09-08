---
name: verification-loop
description: Enforces a strict verification checklist before declaring any coding task finished. Never claim success without evidence.
---

# Verification Loop & Quality Gate

Before declaring any feature, bugfix, or refactoring complete, run through this automated gate.

## Verification Checklist

- [ ] **Tests pass deterministically**: Run unit/integration tests (`npm test`, `pytest`, etc.).
- [ ] **Lint & typecheck pass**: Run linter and typecheck (`npm run lint`, `tsc --noEmit`).
- [ ] **No orphaned code**: Ensure no unused imports, lingering debug logs, or forgotten temporary files exist.
- [ ] **Evidence captured**: View the actual command output and exit codes before communicating completion to the user.
