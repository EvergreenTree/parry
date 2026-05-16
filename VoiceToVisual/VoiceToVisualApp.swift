import SwiftUI

@main
struct VoiceToVisualApp: App {
    @StateObject private var store = GenerationStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
