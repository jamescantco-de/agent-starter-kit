# Swift 6.2 Concurrency Checklist

1. **MainActor**: Always mark view models and UI-updating functions with `@MainActor`.
2. **Sendable**: Ensure all data models transferred across concurrency domains conform to `Sendable`.
3. **Task Cancellation**: Check `Task.isCancelled` inside long-running loops.
