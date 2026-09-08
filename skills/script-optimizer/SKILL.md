---
name: script-optimizer
description: Identifies repetitive, mechanical LLM tasks and automates them into 0-token deterministic scripts following the 1-2-3 Rule.
---

# Script Optimizer — The 1-2-3 Rule

LLMs excel at high-level reasoning and creative generation, but burning LLM tokens on mechanical string transformations, log parsing, or file renaming is wasteful and slow.

## The 1-2-3 Rule

1. **Run 1 (Exploration)**: Work through the task manually with the agent in conversational mode.
2. **Run 2 (Pattern Recognition)**: If the same pattern is needed a second time, document the exact procedural steps as a repeatable SOP or skill.
3. **Run 3 (Automation)**: If the task is performed three times in a week, convert it into a local script (`scripts/*.sh`, `scripts/*.py`, or `scripts/*.mjs`).

## Examples of 0-Token Conversions
- **Log filtering**: Instead of dumping 5,000 lines of build logs into context, use `grep -E "error|warn"` or RTK proxying.
- **Data formatting**: Convert CSV/JSON data structures using a Python one-liner instead of asking an LLM to reformat row-by-row.
- **Repository health checks**: Write a shell script to verify environment variables, package installations, and git status.
