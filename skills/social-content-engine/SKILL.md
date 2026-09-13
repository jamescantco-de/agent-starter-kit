---
name: social-content-engine
description: Multi-platform social publishing, native thread drafting, cross-posting matrices, and direct API distribution. Triggers on 'draft social', 'crosspost this', 'publish update', or 'social campaign'.
---

# Social Content Engine (SuperSkill)

This SuperSkill adapts and distributes content across X, LinkedIn, Bluesky, and Threads, respecting each platform's native mechanics, voice profiles, and direct API integrations.

## Execution Phases & Progressive Disclosure

### Phase 1: Source Asset Synthesis & Voice Calibration
> *Load reference module for tone and style*:
> Read [`references/brand-voice.md`](references/brand-voice.md)
- Extract core hooks and technical insights from the source article/repo.
- Enforce British English spelling and eliminate banned AI buzzwords.

### Phase 2: Platform-Native Adaptation Matrix
> *Load reference module for platform formatting constraints*:
> Read [`references/platform-matrix.md`](references/platform-matrix.md)
- **X (Twitter)**: High-conviction opening hook, numbered thread structure or Long-Form DraftJS Article.
- **Bluesky**: Punchy, conversational 5-post thread, strictly under 300 characters per post with rich link facets.
- **LinkedIn**: Documented business lesson, line-break formatting, zero hashtags in body.

### Phase 3: API Staging & Idempotent Scheduling
> *Load reference module for API dispatch and launchd*:
> Read [`references/api-publishing.md`](references/api-publishing.md)
- Stage drafts to live dashboards for user review prior to broadcast.
- Configure launchd daemons with idempotency ledgers (`published.json`).

## Output Format
Present platform-adapted drafts with character counts and verified link facets.
