---
name: quality-engineering
description: Deterministic quality control, Test-Driven Development (TDD), root-cause debugging, and pre-completion verification gates. Triggers on 'verify', 'test suite', 'debug this', or 'pre-merge check'.
---

# Quality Engineering Protocol (SuperSkill)

This SuperSkill enforces rigorous test-driven delivery, systematic root-cause debugging, and non-negotiable verification gates before declaring work complete.

## Operational Modes
- **Bug Diagnosis**: Write reproduction test, diagnose root cause, apply surgical fix.
- **Feature Delivery**: TDD red-green-refactor loop targeting 80%+ test coverage.
- **Pre-Merge Gate**: Full compile, lint, test, and build verification pass.

## Execution Phases & Progressive Disclosure

### Phase 1: Fact-Forcing & Schema Investigation (GateGuard)
> *Load reference module before modifying critical code*:
> Read [`references/investigation-gates.md`](references/investigation-gates.md)
- Never assume schema layouts or library versions. Inspect actual files, imports, and types.
- Confirm exact reproduction steps before writing code.

### Phase 2: Test-Driven Red-Green Loop
> *Load reference module for test methodology*:
> Read [`references/tdd-patterns.md`](references/tdd-patterns.md)
- Write a minimal failing test that reproduces the bug or defines the feature contract.
- Run the test suite and observe the failure.
- Implement the minimal code required to turn the test green.

### Phase 3: Systematic Root-Cause Debugging
> *Load reference module when diagnosing unexpected errors*:
> Read [`references/systematic-debugging.md`](references/systematic-debugging.md)
- Follow the 4-step diagnostic protocol: Capture -> Reproduce -> Isolate -> Resolve.
- Never guess or patch symptoms. Fix the root mechanism.

### Phase 4: Verification Before Completion
> *Load reference module before claiming done*:
> Read [`references/verification-gates.md`](references/verification-gates.md)
- Run type check (`tsc --noEmit`), linter, unit tests, and build command.
- Confirm zero errors with actual terminal output proof.

## Output Format
Always confirm verification status:
`✅ Typecheck: Passed | ✅ Tests: X passed | ✅ Build: Passed | Ready for commit`
