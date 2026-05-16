import AVFoundation
import Foundation

@MainActor
final class SpeechCaptureService: NSObject, ObservableObject {
    enum CaptureError: LocalizedError {
        case permissionDenied
        case cannotStart

        var errorDescription: String? {
            switch self {
            case .permissionDenied:
                return "Microphone permission denied."
            case .cannotStart:
                return "Unable to start recording."
            }
        }
    }

    @Published private(set) var isRecording = false
    @Published private(set) var elapsedSeconds = 0
    @Published private(set) var level: Float = 0

    private var recorder: AVAudioRecorder?
    private var timer: Timer?
    private var startDate: Date?
    private(set) var outputURL: URL?

    func requestPermission() async -> Bool {
        await withCheckedContinuation { continuation in
            if AVAudioSession.sharedInstance().recordPermission == .granted {
                continuation.resume(returning: true)
                return
            }
            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                continuation.resume(returning: granted)
            }
        }
    }

    func startRecording() async throws {
        guard await requestPermission() else { throw CaptureError.permissionDenied }

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playAndRecord, mode: .spokenAudio, options: [.defaultToSpeaker, .allowBluetooth])
        try session.setActive(true)

        outputURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("voice-\(UUID().uuidString)")
            .appendingPathExtension("m4a")

        guard let outputURL else { throw CaptureError.cannotStart }

        let settings: [String: Any] = [
            AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
            AVSampleRateKey: 16_000,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue,
        ]

        recorder = try AVAudioRecorder(url: outputURL, settings: settings)
        recorder?.isMeteringEnabled = true
        recorder?.record()

        isRecording = true
        elapsedSeconds = 0
        level = 0
        startDate = Date()

        timer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self, let recorder else { return }
            recorder.updateMeters()
            let raw = recorder.averagePower(forChannel: 0)
            level = max(0, min(1, (raw + 60) / 60))
            if let start = startDate {
                elapsedSeconds = Int(Date().timeIntervalSince(start))
            }
        }
    }

    func stopRecording() throws -> URL {
        guard let recorder else { throw CaptureError.cannotStart }

        recorder.stop()
        let url = recorder.url

        isRecording = false
        timer?.invalidate()
        timer = nil
        startDate = nil
        level = 0
        elapsedSeconds = 0
        self.recorder = nil

        return url
    }
}
