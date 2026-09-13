# Reduced Motion Enforcement

```typescript
import { useReducedMotion } from 'motion/react';

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
      transition={springs.smooth}
    >
      {children}
    </motion.div>
  );
}
```
