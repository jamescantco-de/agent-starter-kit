# Verification Before Completion Gate

Never declare a task "complete", "fixed", or "passing" without running verification commands:
1. `npm test` or framework test runner -> All passing.
2. `npm run build` or compile command -> Zero errors.
3. Linter / Typechecker -> Clean output.
Present deterministic command output proof with your final summary.
