---
name: design-polish
description: Design engineering, typography scales, tactile micro-spacing, active states, design systems, and aesthetic polish. Triggers on 'polish UI', 'design review', 'make it look better', or 'style this'.
---

# Design Polish Protocol (SuperSkill)

This SuperSkill transforms functional UI components into tactile, production-grade consumer interfaces through deliberate design engineering.

## Operational Modes
- **Component Polish**: Refine hit targets, active states, hover transitions, and spacing.
- **Design System Audit**: Audit tokens, typography hierarchy, contrast, and colour palettes.

## Execution Phases & Progressive Disclosure

### Phase 1: Aesthetic Style & Palette Selection
> *Load reference module for archetypes and colour pairings*:
> Read [`references/design-intelligence.md`](references/design-intelligence.md)
- Select a clear design archetype (e.g. Minimalist Stark, Dark Cyberpunk, Modern Luxury, Playful Clay).
- Enforce strict 60-30-10 colour distribution (Dominant, Secondary, Vibrant Accent).

### Phase 2: Typography & Spacing Hierarchy
> *Load reference module for optical polish*:
> Read [`references/tactile-polish.md`](references/tactile-polish.md)
- Establish consistent type scales (Headline, Subheading, Body, Micro-label).
- Ensure strict 4px/8px spatial rhythm; avoid arbitrary padding.
- Enforce minimum 44×44px touch targets on mobile viewports.

### Phase 3: Micro-Interactions & States
- Define distinct states for every interactive element: Default, Hover, Focus-Visible, Active/Pressed, Disabled.
- Apply tactile pressed states (`scale(0.97)`, subtle border glow).
- Implement accessible focus rings (`focus-visible:ring-2`).

### Phase 4: Dynamic Materials & Depth (Optional)
> *Load reference module for Apple-style glass*:
> Read [`references/liquid-glass.md`](references/liquid-glass.md)
- Backdrop blur, frosted glass borders, and layered specular highlights.

## Output Format
Deliver UI code with clear visual polish rationale explaining typography, contrast, and tactile state decisions.
