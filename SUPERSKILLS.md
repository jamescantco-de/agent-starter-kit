Last week, I published my Agent Starter Kit and wrote about how I saved 18 million tokens on dev operations by treating AI agents like capable junior engineers rather than magic wizards.

The response was fantastic, but as soon as people get their agents synced and start building custom skills, they almost universally run headfirst into a new wall.

I call it The Skill Sprawl Trap.

Here is what happens: you realise skills are brilliant, so you start adding them for everything. You write a skill for React performance. A skill for API security. A skill for database queries. A skill for Playwright testing. Before you know it, your skills folder has 50, 80, or in my case, over 180 skills sitting in it.

You think you have built an unstoppable agent.

Then you look under the bonnet, and you realise two alarming things are happening:

1. Your agent is silently ignoring dozens of your skills. Agent platforms enforce strict context budget limits on boot. When your skill descriptions exceed that budget, the system quietly drops the excess. You think your agent has 180 skills; in reality, 40 of them were discarded before you even typed your prompt.
2. Attention Dilution ("Lost in the Middle"). When an agent has to evaluate 100 candidate tools for every request, its attention degrades. It gets confused between five overlapping security skills, hallucinates instructions, or forgets your foundational rules.

Worse still, you have accidentally made yourself a micromanager again. Instead of delegating an outcome, you have to remember which hyper-specific micro-skill to trigger.

I don't know how to code. I'm a Dad, I lead commercial revenue teams, and when I'm building apps in the evenings, I don't have the patience or time to babysit an agent through twelve sub-commands just to check a pull request.

To fix this, I didn't invent some novel AI framework. I borrowed a 40-year-old principle from human-computer interaction: Progressive Disclosure.

Here is what it is, why it matters, and how consolidating into "SuperSkills" transforms how agents perform.

---

### Where Progressive Disclosure Came From

In the 1980s and 90s, early software interfaces were absolute chaos. Engineers would cram every single button, toggle, dialogue box, and setting onto the screen at once. If a word processor had 200 features, you saw 200 tiny icons staring back at you.

It was overwhelming, slow, and users made endless mistakes.

To solve this, pioneers like Jakob Nielsen (Nielsen Norman Group) and the designers of the Apple Human Interface Guidelines (HIG) formalised the concept of Progressive Disclosure:

Show only the essential information needed for the primary task upfront. Defer advanced, specialised, or secondary details until the user explicitly requests them.

Think about the macOS print dialogue. When you press Cmd + P, you see three basic controls: Destination, Copies, and Pages. You don't see postscript rasterisation settings, halftone screening, or CMYK colour profiles. Those live behind an "Advanced Settings" disclosure triangle.

The advanced power is 100% accessible, but it doesn't clutter your mental workspace unless you ask for it.

---

### Translating Progressive Disclosure to AI Agents

In 2026, LLM context windows are essentially the working memory of your agent.

When you dump 180 micro-skills, 50 API schemas, and 20 edge-case manuals into an agent's system prompt, you are making the exact same mistake 1980s software designers made: cognitive overload.

Stanford researchers and frontier AI labs have extensively documented the "Lost in the Middle" phenomenon: when an LLM is flooded with massive context, its ability to retrieve and accurately follow instructions buried in the middle drops off a cliff.

Progressive Disclosure for AI agents structures context into three distinct tiers of awareness:

Level 1 — The System Registry (~30 tokens per skill):
On session boot, the agent only sees a 1-sentence description and trigger keywords inside the YAML frontmatter of SKILL.md. It knows the skill exists, but none of the actual documentation is loaded into memory yet.

Level 2 — The Workflow Router (< 150 lines of Markdown):
When you ask for a task, the agent opens the top-level SKILL.md. This file contains no exhaustive manuals. It simply outlines the high-level decision tree, the primary phases of the job, and pointers to deeper reference files.

Level 3 — Just-in-Time Deep References (Loaded On Demand):
Detailed checklists, framework gotchas, and regex patterns live in a sub-folder called references/ (e.g. references/api-auth.md, references/database-indexes.md). The agent only pulls a reference file into its active context window using a file-reading tool if and when that specific scenario arises.

Zero context waste. 100% depth preserved.

---

### Enter the "SuperSkill": Delegating Outcomes, Not Micro-Commands

Once you apply Progressive Disclosure, the entire idea of having 180 fragmented micro-skills collapses.

In my own workflow, I never sit down at my terminal and type:
"Run evm-token-decimals, then check contract-math, then run security-bounty-hunter."

That is ridiculous. I say:
"Run a security audit on this PR."

I want the outcome, not the chore of orchestrating five sub-routines.

By consolidating micro-skills into SuperSkills, you group related domains into comprehensive, unified capabilities. In my setup, ~180 micro-skills collapsed cleanly into 12 SuperSkills:

1. security-audit: Merges auth barriers, API vulnerability hunting, secret scanning, and agent spend limits into one pass.
2. performance-review: Combines Core Web Vitals (LCP/CLS), React re-render profiling, bundle analysis, and database query indexing.
3. quality-engineering: Unifies test-driven development (TDD), reproduction scripts, 80%+ test coverage, and pre-commit verification gates.
4. design-polish: Combines typography hierarchies, micro-spacing, tactile active states, and design tokens into a single design-engineering pass.
5. motion-engineering: Standardises spring physics, layout transitions, gestures, and reduced-motion accessibility for React and Next.js.
6. database-ops: Unifies relational schema design, indexing, analytical table design, and zero-downtime migrations.

...and so on across Cloud Data, Mobile, and Social Content.

---

### Anatomy of a Production SuperSkill

How does a SuperSkill actually look in code? Here is the structure we use:

skills/security-audit/
├── SKILL.md                  # Master router (< 150 lines: phases, fast vs full mode)
└── references/
    ├── api-auth.md           # JWT, CORS, rate limits, session tokens
    ├── vulnerabilities.md    # SQLi, XSS, SSRF, IDOR checklist
    ├── agent-guardrails.md   # Spend caps, circuit breakers, tool authorisation
    └── smart-contracts.md    # Reentrancy, integer math, oracle manipulation

The master SKILL.md operates like a senior triage engineer:

---
name: security-audit
description: Complete vulnerability and security audit. Triggers on "security audit", "vulnerability scan", "audit auth", or "pre-merge check".
---

# Security Audit Protocol

When triggered, determine the audit mode:
1. Quick Scan (Focused review of a specific diff or endpoint).
2. Full Audit (Exhaustive pre-merge or pre-deploy battery).

## Execution Phases:
- Phase 1: Attack Surface Discovery (Map all public routes, inputs, and RPCs).
- Phase 2: Authentication & Authorisation -> Read references/api-auth.md if reviewing web endpoints.
- Phase 3: Vulnerability Assessment -> Read references/vulnerabilities.md.
- Phase 4: Autonomous Agent Guardrails -> Read references/agent-guardrails.md if the codebase gives agents wallet or terminal access.

## Output Format:
Always deliver a structured Markdown table:
[Severity] | [Vulnerability] | [File & Line] | [Deterministic Fix]

When I ask for a security review of an Express API, the agent reads SKILL.md, sees that Phase 2 and 3 apply, reads only those two reference files, and completely ignores the smart contract rules.

My token consumption stays minimal, the agent's attention remains laser-focused, and I get an enterprise-grade audit in a single pass.

---

### The Big Lesson

When building with AI agents, the instinct is always more. More prompts, more skills, more tools, more text.

In reality, software engineering taught us the answer decades ago: Discipline and hierarchy beat volume every single time.

Don't choke your agents with 200 fragmented commands. Build lean, modular SuperSkills, let Progressive Disclosure do the heavy lifting, and spend your time building things that matter.

---

### The Open Source SuperSkills Repo (`superskills`)

Rather than leaving you to restructure your own skills folder from scratch, I have packaged our complete production setup into a free, open-source repository:

👉 **GitHub: [github.com/jamescantco-de/superskills](https://github.com/jamescantco-de/superskills)**

Inside, you will find all 12 production SuperSkills—covering security, performance, quality engineering, design, motion, and database operations—pre-built with the 3-tier Progressive Disclosure architecture.

If you haven't set up your single source of truth (`AGENTS.md`) and token-saving CLI proxy yet, you can also grab the foundational **[Agent Starter Kit](https://github.com/jamescantco-de/agent-starter-kit)**.

Drop them into your `skills/` folder, try running an audit, and see the difference when your agent isn't fighting cognitive overload.

Ta,

James

James Nunn  
Creator, James Can't Code  
[jamescantco.de](https://jamescantco.de) | [@JamesCantCode](https://x.com/JamesCantCode)
