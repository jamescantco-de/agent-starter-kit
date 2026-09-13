---
name: fullstack-mobile
description: Native iOS (SwiftUI, Swift 6.2, Actor Persistence) and Kotlin Multiplatform mobile development. Triggers on 'iOS architecture', 'mobile build', 'Swift review', or 'mobile app'.
---

# Full-Stack Mobile Protocol (SuperSkill)

This SuperSkill guides modern native mobile engineering with an emphasis on SwiftUI, Swift 6.2 approachable concurrency, offline-first actor persistence, and KMP architecture.

## Execution Phases & Progressive Disclosure

### Phase 1: Modern SwiftUI & Observation
> *Load reference module for modern state architecture*:
> Read [`references/swiftui-state.md`](references/swiftui-state.md)
- Use `@Observable` macro (iOS 17+) over legacy `ObservableObject` / `@Published`.
- Keep view models focused and decouple presentation from network calls.

### Phase 2: Swift 6.2 Concurrency & Thread Safety
> *Load reference module for concurrency compliance*:
> Read [`references/swift-concurrency.md`](references/swift-concurrency.md)
- Single-threaded by default; use `@concurrent` for background CPU offloading.
- Isolate conformances to `@MainActor` for UI updates.
- Eliminate data races with compiler-enforced Sendable checks.

### Phase 3: Offline-First Actor Persistence
> *Load reference module for local data caching*:
> Read [`references/actor-persistence.md`](references/actor-persistence.md)
- Implement thread-safe in-memory cache backed by asynchronous file storage using actors.
- Guarantee instant UI rendering from local cache with background synchronization.

## Output Format
Deliver idiomatic Swift/Kotlin code with clear concurrency safety notes.
