# Layout Motion & AnimatePresence Checklist

1. **Shared Elements**: Use `layoutId="tab-indicator"` for tabs and pill selectors.
2. **Exit Animations**: Always wrap conditionally rendered motion components in `<AnimatePresence mode="wait">`.
3. **GPU Acceleration**: Animate only `transform` (`x`, `y`, `scale`) and `opacity`. Never animate `width`, `height`, `top`, or `margin`.
