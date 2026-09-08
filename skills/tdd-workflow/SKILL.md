---
name: tdd-workflow
description: Enforces test-driven development and deterministic verification before code is considered complete. Use when implementing new features, fixing bugs, or refactoring existing logic.
---

# Test-Driven Development (TDD) Workflow

This skill ensures that all code produced by AI agents is grounded in deterministic automated tests rather than optimistic assumptions.

## The Three Golden Rules

1. **Write the test before the fix**: When fixing a bug, write a failing unit or integration test that clearly reproduces the issue. Run it to confirm failure.
2. **Minimum code to pass**: Write only the exact code needed to satisfy the test. Avoid speculative extras.
3. **Refactor under green**: Only clean up or optimize code once tests are passing. Re-run tests immediately after refactoring.

## Bug Fix Workflow
1. Locate reproduction steps.
2. Add a failing test case in the test suite.
3. Run test: `npm test` / `pytest` / `go test`. Confirm exit code != 0.
4. Apply surgical code fix.
5. Re-run test. Confirm exit code == 0.
6. Verify no regressions across adjacent tests.
