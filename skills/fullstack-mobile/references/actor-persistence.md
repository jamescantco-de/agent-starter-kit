# Swift Actor Persistence Pattern

```swift
actor CacheStorage<T: Codable & Sendable> {
    private var memoryCache: [String: T] = [:]
    private let fileURL: URL
    
    init(fileURL: URL) {
        self.fileURL = fileURL
    }
    
    func get(_ key: String) -> T? {
        return memoryCache[key]
    }
    
    func set(_ key: String, value: T) async throws {
        memoryCache[key] = value
        let data = try JSONEncoder().encode(memoryCache)
        try data.write(to: fileURL, options: .atomic)
    }
}
```
