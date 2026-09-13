# RFC DAG Execution Pattern

1. **Work Unit Decomposition**: Break down the project specification into discrete work units.
2. **Quality Gates**: Every work unit must define deterministic verification commands (e.g. `npm test`) that must pass before the next unit begins.
