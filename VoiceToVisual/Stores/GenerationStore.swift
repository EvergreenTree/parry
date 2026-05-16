import Foundation

@MainActor
final class GenerationStore: ObservableObject {
    enum Phase: String {
        case idle = "Idle"
        case recording = "Recording"
        case transcribing = "Transcribing"
        case reasoning = "Reasoning"
        case prompting = "Building image prompt"
        case generating = "Generating image"
        case done = "Done"
        case failed = "Failed"
    }

    @Published private(set) var isBusy = false
    @Published private(set) var phase: Phase = .idle
    @Published private(set) var statusMessage = "Tap Record and speak your scene."

    @Published var transcript = ""
    @Published var reasoningText = ""
    @Published var imagePrompt = ""
    @Published var imageURL: URL?
    @Published var imageLoading = false
    @Published var errorMessage: String?

    @Published var slngApiKeySet = false
    @Published var falApiKeySet = false

    private let recorder = SpeechCaptureService()
    private let slngService = SLNGService()
    private let pioneerService = PioneerService()

    var isRecording: Bool { recorder.isRecording }
    var elapsedSeconds: Int { recorder.elapsedSeconds }
    var level: Float { recorder.level }

    var slngApiKeyStatus: String { AppConfig.keyStatusText(AppConfig.speechApiKey) }
    var falApiKeyStatus: String { AppConfig.keyStatusText(KeychainStore.shared.load(for: AppConfig.Keys.falApiKey) ?? "") }
    var pioneerApiKeyStatus: String { AppConfig.keyStatusText(AppConfig.pioneerApiKey) }

    init() {
        updateKeyStatus()
    }

    func updateKeyStatus() {
        slngApiKeySet = !AppConfig.speechApiKey.isEmpty
        falApiKeySet = !AppConfig.normalized(KeychainStore.shared.load(for: AppConfig.Keys.falApiKey)).isEmpty
    }

    func saveRuntimeKey(_ key: String, for account: String) {
        let normalized = AppConfig.normalized(key)
        if normalized.isEmpty {
            KeychainStore.shared.delete(for: account)
        } else {
            try? KeychainStore.shared.save(normalized, for: account)
        }
        updateKeyStatus()
    }

    func startOrStopRecording() async {
        if isBusy {
            return
        }

        if recorder.isRecording {
            do {
                statusMessage = "Stopping and transcribing..."
                phase = .transcribing
                let url = try recorder.stopRecording()
                clearResults(keepTranscript: true)
                await processRecording(url: url)
            } catch {
                phase = .failed
                errorMessage = error.localizedDescription
                statusMessage = "Recording failed."
                isBusy = false
            }
        } else {
            guard !AppConfig.pioneerApiKey.isEmpty,
                  slngApiKeySet,
                  falApiKeySet else {
                errorMessage = "Please configure all API keys in Settings first."
                phase = .failed
                statusMessage = "Keys missing."
                return
            }

            clearResults(keepTranscript: false)
            phase = .recording
            statusMessage = "Recording... tap again to stop."
            errorMessage = nil
            do {
                try await recorder.startRecording()
            } catch {
                phase = .failed
                errorMessage = error.localizedDescription
                statusMessage = "Could not start recording."
                isBusy = false
            }
        }
    }

    private func processRecording(url: URL) async {
        isBusy = true
        defer {
            isBusy = false
            imageLoading = false
            updateKeyStatus()
        }

        do {
            let transcribed = try await slngService.transcribe(audioURL: url)
            transcript = transcribed.text

            phase = .reasoning
            statusMessage = "Reasoning over the scene..."

            async let reasoningTask = pioneerService.analyzeScene(transcript: transcript, mode: .reasoning)
            async let promptTask = pioneerService.analyzeScene(transcript: transcript, mode: .imagePrompt)

            let reasoning = try await reasoningTask
            let promptResult = try await promptTask

            reasoningText = reasoning.analysisText
            imagePrompt = promptResult.imagePrompt

            phase = .generating
            imageLoading = true
            statusMessage = "Generating image with fal..."

            let key = KeychainStore.shared.load(for: AppConfig.Keys.falApiKey) ?? ""
            let generated = try await FalService().generateImage(prompt: imagePrompt, key: key)
            imageURL = URL(string: generated.url)

            phase = .done
            statusMessage = "Done."
        } catch {
            phase = .failed
            errorMessage = error.localizedDescription
            statusMessage = "Pipeline stopped with an error."
        }
    }

    private func clearResults(keepTranscript: Bool) {
        errorMessage = nil
        reasoningText = ""
        imagePrompt = ""
        imageURL = nil
        imageLoading = false
        if !keepTranscript {
            transcript = ""
        }
    }
}
