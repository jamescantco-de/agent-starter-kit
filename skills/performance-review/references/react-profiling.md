# React & Next.js Performance Checklist

1. **Re-render Discipline**:
   - Push state down to leaf components rather than lifting to broad container providers.
   - Use `useCallback` and `useMemo` strictly when passing callbacks to memoized children.
   - Never create component definitions or inline functions inside parent render loops.

2. **Bundle & Server Component Boundaries**:
   - Mark interactive components with `'use client'` only at the leaf level.
   - Dynamically import heavy interactive modules (charts, rich text editors, 3D canvases).
