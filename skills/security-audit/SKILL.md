---
name: security-audit
description: Comprehensive security and vulnerability audit across APIs, auth boundaries, autonomous agent spend limits, and contracts. Triggers on 'security audit', 'vulnerability scan', 'audit auth', or 'security review'.
---

# Security Audit Protocol (SuperSkill)

This SuperSkill executes multi-phase security assessments across web APIs, cloud backends, smart contracts, and autonomous agent permissions.

## Operational Modes
- **Quick Scan** (Default for focused diffs, PR checks, or single endpoints): Rapid inspection of modified files for secrets, auth gaps, and unvalidated inputs.
- **Full Audit** (Triggered by "full audit", "comprehensive review", or "pre-deploy audit"): Exhaustive 5-phase battery across the entire attack surface.

## Execution Phases & Progressive Disclosure

### Phase 1: Attack Surface & Input Discovery
- Map all public routes, RPC endpoints, and webhook receivers.
- Inspect request payloads, query parameters, and header parsing for unvalidated inputs.

### Phase 2: Authentication, Sessions & Authorisation
> *Load reference module if evaluating web or API auth*:
> Read [`references/api-auth.md`](references/api-auth.md)
- Verify JWT verification (algorithm confusion, expiration, replay).
- Audit Role-Based Access Control (RBAC) and tenant isolation.
- Check CORS configurations, session invalidation, and rate limiting.

### Phase 3: Vulnerability Assessment (OWASP Top 10)
> *Load reference module if reviewing server-side logic*:
> Read [`references/vulnerabilities.md`](references/vulnerabilities.md)
- Scan for SQL Injection, NoSQL injection, and ORM query leaks.
- Check for Insecure Direct Object References (IDOR) and broken object-level authorisation.
- Audit Server-Side Request Forgery (SSRF) in fetch/webhook integrations.

### Phase 4: Autonomous Agent Guardrails & Key Safety
> *Load reference module if codebase equips LLMs with execution/wallet tools*:
> Read [`references/agent-guardrails.md`](references/agent-guardrails.md)
- Verify strict spending limits, daily budget caps, and circuit breakers.
- Check prompt injection defences and pre-execution human gates.
- Verify zero secret leakage in logs, error traces, or LLM observation context.

### Phase 5: Smart Contract & Token Precision (Optional)
> *Load reference module if auditing EVM or DeFi contracts*:
> Read [`references/smart-contracts.md`](references/smart-contracts.md)
- Reentrancy protection (Checks-Effects-Interactions pattern).
- EVM token decimal normalisation and integer math safety.

## Output Format
Always present findings in a deterministic table:
`| Severity (P0-P3) | Vulnerability | Location (file:line) | Deterministic Remediation |`
