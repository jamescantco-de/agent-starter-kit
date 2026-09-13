# Core Web Vitals Checklist

1. **Largest Contentful Paint (LCP < 2.5s)**:
   - Preload primary hero images (`<link rel="preload" as="image">` or Next.js `priority`).
   - Use modern formats (WebP/AVIF) sized to viewport dimensions.
   - Preconnect to critical third-party font/CDN domains.

2. **Cumulative Layout Shift (CLS < 0.1)**:
   - Always declare explicit `width` and `height` or `aspect-ratio` on images and video embeds.
   - Reserve space for dynamic elements (banners, skeleton loaders).

3. **Interaction to Next Paint (INP < 200ms)**:
   - Defer non-critical JavaScript using `requestIdleCallback` or web workers.
   - Break long tasks (>50ms) into micro-tasks using `setTimeout(0)`.
