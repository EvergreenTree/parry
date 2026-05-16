import Foundation

final class PioneerService {
    enum ServiceError: LocalizedError {
        case missingKey
        case badResponse(Int)
        case invalidPayload

        var errorDescription: String? {
            switch self {
            case .missingKey:
                return "Pioneer key missing. Set PIONEER_API_KEY in build settings or Keychain."
            case .badResponse(let code):
                return "Pioneer returned HTTP \(code)."
            case .invalidPayload:
                return "Could not parse Pioneer response."
            }
        }
    }

    private let endpoint = URL(string: "https://api.pioneer.ai/v1/chat/completions")!
    private let modelId: String

    init(modelId: String = "53a3a735-c186-409d-aec4-33ecdc705eca") {
        self.modelId = modelId
    }

    func analyzeScene(transcript: String, mode: PioneerMode) async throws -> PioneerCompletionResult {
        let key = AppConfig.pioneerApiKey
        guard !key.isEmpty else { throw ServiceError.missingKey }

        let systemPrompt = prompt(for: mode)
        let requestPayload = PioneerChatRequest(
            model: modelId,
            messages: [
                .init(role: "system", content: systemPrompt),
                .init(role: "user", content: transcript.isEmpty ? "No transcript provided." : transcript)
            ]
        )

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("Bearer \(key)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(requestPayload)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw ServiceError.badResponse(-1)
        }
        guard 200..<300 ~= httpResponse.statusCode else {
            throw ServiceError.badResponse(httpResponse.statusCode)
        }

        guard let decoded = try? JSONDecoder().decode(PioneerChatResponse.self, from: data),
              let choice = decoded.choices.first else {
            throw ServiceError.invalidPayload
        }

        let body = choice.message.content.trimmingCharacters(in: .whitespacesAndNewlines)

        let imagePrompt: String
        if mode == .reasoning {
            imagePrompt = reasonedPromptFallback(from: body)
        } else {
            imagePrompt = stripPrefixedLines(body)
        }

        return PioneerCompletionResult(analysisText: body, imagePrompt: imagePrompt)
    }

    private func prompt(for mode: PioneerMode) -> String {
        switch mode {
        case .reasoning:
            return """
            You are a visual reasoning assistant. Given a description of an image scene, answer in three parts:
            1) Deconstructing the query
            2) Sweeping the scene
            3) Tallying/identifying the answer
            Then provide a concise final response.
            """
        case .imagePrompt:
            return """
            You are a creative prompt engineer for text-to-image models.
            Return exactly one English image generation prompt only, no explanations.
            Include style, composition, color, lighting, and atmosphere in one line.
            Keep the prompt under 90 words.
            """
        }
    }

    private func reasonedPromptFallback(from body: String) -> String {
        if let line = body
            .components(separatedBy: .newlines)
            .first(where: { $0.localizedCaseInsensitiveContains("Image Prompt:") }) {
            return String(line
                .replacingOccurrences(of: "Image Prompt:", with: "", options: .caseInsensitive))
                .trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return body
    }

    private func stripPrefixedLines(_ text: String) -> String {
        return text
            .components(separatedBy: ":")
            .last?
            .trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
            ?? text
    }
}
