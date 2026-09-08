# Self-Healing Correction Rules

> **How this works**: AI models are prone to repeating patterns unless explicitly restricted. Whenever an agent makes a mistake, misinterprets an instruction, uses a deprecated library, or introduces an anti-pattern:
> 1. Stop and fix the immediate issue.
> 2. Add a single concise, checkable rule to this file.
> 3. AI agents reading `AGENTS.md` are bound to review this file before executing work.
> 
> *Result: You never have to correct the same mistake twice.*

---

## Active Rules

### Tooling & Commands
- **Check installed tools before installing**: Always check if a CLI tool, package, or utility already exists (`which <tool>`, `npm list`) before attempting to install redundant alternatives.
- **Deterministic tests over assertions**: Never report that code "should work" or is "complete" without running tests or build commands directly and viewing output.

### Code Quality & Git Hygiene
- **Surgical edits only**: Never refactor untouched functions or reformat lines outside the direct scope of the task.
- **Clean up orphaned imports**: When removing or replacing code, remove any imports or variables that were made redundant.
- **Zero mock data in production paths**: Do not leave hardcoded test strings or dummy variables in production business logic.

### Communication & Tone
- **Zero AI filler words**: Avoid buzzwords like *delve, seamless, transformative, synergy, cutting-edge, leverage, paradigm, unlock, elevate*. Speak simply and directly.
- **British English**: Use British English spelling (organisation, recognise, whilst, programme, colour).
