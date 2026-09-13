# Modern SwiftUI State Patterns

```swift
import SwiftUI

@Observable
final class ProfileViewModel {
    var username: String = ""
    var isLoading: Bool = false
    
    @MainActor
    func loadData() async {
        isLoading = true
        defer { isLoading = false }
        // Fetch data
    }
}
```
