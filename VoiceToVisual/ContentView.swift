import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: GenerationStore
    @State private var showImage = false

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(spacing: 6) {
                        Text("Voice-to-Visual")
                            .font(.largeTitle).bold()
                        Text("OpenAI Whisper + Pioneer + fal demo")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)

                    keyStatusSection
                    recordSection
                    transcriptSection

                    if !store.reasoningText.isEmpty {
                        reasoningSection
                    }
                    if !store.imagePrompt.isEmpty {
                        promptSection
                    }
                    if let imageURL = store.imageURL {
                        imageSection(for: imageURL)
                    }

                    if let error = store.errorMessage {
                        Text(error)
                            .foregroundStyle(.red)
                            .font(.subheadline)
                            .padding(.vertical, 8)
                    }

                    Spacer(minLength: 40)
                }
                .padding()
            }
            .navigationTitle("Scene Visualizer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink(destination: SettingsView()) {
                        Label("Settings", systemImage: "gear")
                    }
                }
            }
        }
    }

    private var keyStatusSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Tech stack")
                .font(.headline)
            HStack {
                Label("OpenAI Whisper", systemImage: "waveform.path.ecg")
                Spacer()
                Text(store.slngApiKeyStatus)
                    .foregroundStyle(store.slngApiKeySet ? .green : .secondary)
            }
            HStack {
                Label("Pioneer", systemImage: "wand.and.stars")
                Spacer()
                Text(store.pioneerApiKeyStatus)
                    .foregroundStyle(store.pioneerApiKeyStatus == "Configured" ? .green : .secondary)
            }
            HStack {
                Label("fal", systemImage: "photo.artframe")
                Spacer()
                Text(store.falApiKeyStatus)
                    .foregroundStyle(store.falApiKeySet ? .green : .secondary)
            }
            Divider()
            Text(store.statusMessage)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private var recordSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("1) Record scene description")
                .font(.headline)

            HStack {
                Button {
                    Task { await store.startOrStopRecording() }
                } label: {
                    HStack {
                        Image(systemName: store.isRecording ? "stop.fill" : "mic.fill")
                        Text(store.isRecording ? "Stop" : "Record")
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .frame(maxWidth: .infinity)
                    .background(store.isRecording ? Color.red : Color.accentColor)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .disabled(store.isBusy)

                Text(store.elapsedTime)
                    .font(.title3)
                    .monospacedDigit()
                    .frame(width: 70, alignment: .trailing)
            }

            ProgressView(value: Double(store.level), total: 1)
                .accentColor(store.isRecording ? .green : .blue)
            Text(store.isRecording ? "Recording..." : "Tap record and speak")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
    }

    private var transcriptSection: some View {
        Group {
            Text("2) Transcript")
                .font(.headline)
            Text(store.transcript.isEmpty ? "No transcript yet." : store.transcript)
                .foregroundStyle(store.transcript.isEmpty ? .secondary : .primary)
                .padding()
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 12))
        }
    }

    private var reasoningSection: some View {
        Group {
            Text("3) Visual reasoning")
                .font(.headline)
            Text(store.reasoningText)
                .foregroundStyle(.primary)
                .padding()
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
        }
    }

    private var promptSection: some View {
        Group {
            Text("4) Image prompt")
                .font(.headline)
            Text(store.imagePrompt)
                .padding()
                .foregroundStyle(.primary)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
        }
    }

    @ViewBuilder
    private func imageSection(for imageURL: URL) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("5) Generated visual")
                .font(.headline)

            AsyncImage(url: imageURL) { phase in
                switch phase {
                case .empty:
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .frame(height: 220)
                case .success(let loaded):
                    loaded
                        .resizable()
                        .scaledToFit()
                        .frame(maxHeight: 280)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .onTapGesture { showImage = true }
                case .failure:
                    HStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                        Text("Could not fetch image")
                    }
                    .foregroundStyle(.red)
                    .frame(height: 220)
                @unknown default:
                    EmptyView()
                }
            }
            .sheet(isPresented: $showImage) {
                NavigationView {
                    FullImageView(imageURL: imageURL)
                }
            }

            if store.imageLoading {
                ProgressView("Generating image…")
            }
        }
        .padding(.vertical, 8)
    }
}

private extension GenerationStore {
    var elapsedTime: String {
        let seconds = elapsedSeconds
        let minutes = seconds / 60
        let remainder = seconds % 60
        return String(format: "%02d:%02d", minutes, remainder)
    }
}
