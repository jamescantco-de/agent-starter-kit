# Autonomous Agent Safety & Spend Limits

1. **Financial & Spend Guardrails**:
   - Implement strict per-task and daily hard budget caps on autonomous actions.
   - Force deterministic pre-execution simulation before triggering wallet transactions.
   - Implement dead-man switches and circuit breakers that halt on consecutive failures.

2. **Action Space & Prompt Injection**:
   - Treat all external web and database inputs as untrusted payloads; never execute untrusted strings directly in shell tools.
   - Enforce human approval gates on irreversible or destructive actions (file deletion, database drops, transfers).
