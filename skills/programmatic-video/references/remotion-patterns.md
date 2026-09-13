# Remotion React Video Standards

1. **Frame Accuracy**: Always derive all animations from `useCurrentFrame()` and `useVideoConfig()`.
2. **Interpolation**: Clamp interpolations (`extrapolateLeft: 'clamp', extrapolateRight: 'clamp'`).
3. **Asset Handling**: Load audio and fonts via `@remotion/preload` or static file imports.
