---
name: motion-engineering
description: Fluid, accessible animation system for React and Next.js using standardized spring presets, layout transitions, and gestures. Triggers on 'animate this', 'add motion', 'page transition', or 'framer motion'.
---

# Motion Engineering Protocol (SuperSkill)

This SuperSkill implements production-ready animation and micro-interactions for React and Next.js using modern motion primitives.

## Operational Modes
- **Micro-Interaction**: Button presses, hover effects, icon state changes.
- **Component Motion**: Modals, toasts, dropdowns, accordion expanding panels.
- **Page Transitions**: Fluid layout transitions and route changes.

## Execution Phases & Progressive Disclosure

### Phase 1: Spring Presets & Token Selection
> *Load reference module for standard spring tokens*:
> Read [`references/spring-tokens.md`](references/spring-tokens.md)
- Select physics-based springs over linear/easing curves.
- Use snappy springs for buttons/toggles; gentle springs for modals/drawers.

### Phase 2: Accessibility & Reduced Motion
> *Load reference module for a11y compliance*:
> Read [`references/reduced-motion.md`](references/reduced-motion.md)
- Respect `prefers-reduced-motion` across all animations.
- Fallback gracefully to instant opacity fades when reduced motion is preferred.

### Phase 3: Layout & Gestures (Drag, Stagger, Exit)
> *Load reference module for advanced layout motion*:
> Read [`references/layout-transitions.md`](references/layout-transitions.md)
- Use `layout` and `layoutId` for shared element transitions.
- Wrap dynamic arrays in `AnimatePresence` with explicit `key` props.
- Keep animation durations under 300ms for UI responsiveness.

## Output Format
Deliver performant, SSR-safe React animation code using standardized spring tokens.
