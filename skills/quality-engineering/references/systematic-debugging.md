# Systematic Debugging Protocol

1. **Reproduce**: Create a deterministic test script or curl command replicating the failure.
2. **Isolate**: Formulate a single testable hypothesis. Inspect variable state and call stacks.
3. **Resolve**: Fix the underlying defect. Run the reproduction script to prove resolution.
4. **Document**: If the bug was caused by a repeated agent mistake, log it into `Correction Rules.md`.
