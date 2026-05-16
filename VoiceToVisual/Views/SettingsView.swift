import SwiftUI
import Foundation
#if canImport(UIKit)
import UIKit
#endif

struct SettingsView: View {
    @EnvironmentObject private var store: GenerationStore

    @State private var speechApiKey = ""
    @State private var falKey = ""
    @State private var pioneerKey = ""
    @State private var saveMessage = ""

    var body: some View {
        NavigationView {
            Form {
                Section("Speech-to-Text API Key (OpenAI)") {
                    SecureField("OpenAI API Key", text: $speechApiKey)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                    Button("Save OpenAI key") {
                        store.saveRuntimeKey(speechApiKey, for: AppConfig.Keys.openAIApiKey)
                        if !AppConfig.normalized(speechApiKey).isEmpty {
                            try? KeychainStore.shared.save(AppConfig.normalized(speechApiKey), for: AppConfig.Keys.slngApiKey)
                        }
                        saveMessage = "OpenAI key saved."
                    }
                }

                Section("fal API Key") {
                    SecureField("fal API Key", text: $falKey)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                    Button("Save fal key") {
                        store.saveRuntimeKey(falKey, for: AppConfig.Keys.falApiKey)
                        saveMessage = "fal key saved."
                    }
                }

                Section("Pioneer") {
                    SecureField("Pioneer API Key", text: $pioneerKey)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                    HStack {
                        Button("Paste Pioneer key from clipboard") {
                            pioneerKey = pasteFromClipboard()
                        }
                        Spacer()
                        Button("Save Pioneer key") {
                            store.saveRuntimeKey(pioneerKey, for: AppConfig.Keys.pioneerApiKey)
                            saveMessage = "Pioneer key saved."
                            store.updateKeyStatus()
                        }
                    }
                    Text("Loaded from: \(AppConfig.pioneerApiKey.isEmpty ? "Not configured" : "Keychain / config")")
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                }

                if !saveMessage.isEmpty {
                    Section {
                        Text(saveMessage).foregroundStyle(.green)
                    }
                }

                Section("Key status") {
                    HStack {
                        Label("OpenAI Whisper", systemImage: "waveform.path")
                        Spacer()
                        Text(store.slngApiKeyStatus)
                    }
                    HStack {
                        Label("fal", systemImage: "photo")
                        Spacer()
                        Text(store.falApiKeyStatus)
                    }
                    HStack {
                        Label("Pioneer", systemImage: "brain")
                        Spacer()
                        Text(store.pioneerApiKeyStatus)
                    }
                }
            }
            .navigationTitle("Settings")
            .onAppear {
                speechApiKey = AppConfig.speechApiKey
                falKey = KeychainStore.shared.load(for: AppConfig.Keys.falApiKey) ?? ""
                pioneerKey = KeychainStore.shared.load(for: AppConfig.Keys.pioneerApiKey) ?? ""
                store.updateKeyStatus()
            }
        }
    }

    private func pasteFromClipboard() -> String {
        #if canImport(UIKit)
        return UIPasteboard.general.string ?? ""
        #else
        return ""
        #endif
    }
}
