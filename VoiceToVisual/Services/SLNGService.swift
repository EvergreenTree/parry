import Foundation

final class SLNGService {
    enum ServiceError: LocalizedError {
        case missingKey
        case unauthorized(String?)
        case serviceUnavailable(String?)
        case badResponse(Int)
        case invalidPayload

        var errorDescription: String? {
            switch self {
            case .missingKey:
                return "OpenAI key missing. Configure it in Settings."
            case .unauthorized(let details):
                let suffix = details.map { "\($0)" } ?? "please check OPENAI_API_KEY."
                return "OpenAI returned HTTP 401. Verify your OpenAI API key is correct and active. Details: \(suffix)"
            case .serviceUnavailable(let details):
                let suffix = details.map { "\($0)" } ?? "temporary outage or capacity issue."
                return "OpenAI returned HTTP 503. Service is temporarily unavailable; retry in a few moments. Details: \(suffix)"
            case .badResponse(let code):
                return "OpenAI returned HTTP \(code)."
            case .invalidPayload:
                return "OpenAI response was invalid."
            }
        }
    }

    private let endpoint = URL(string: "https://api.openai.com/v1/audio/transcriptions")!
    private let model = "whisper-1"

    func transcribe(audioURL: URL, language: String? = nil) async throws -> SLNGSTTResult {
        guard let stored = KeychainStore.shared.load(for: AppConfig.Keys.openAIApiKey) ?? KeychainStore.shared.load(for: AppConfig.Keys.slngApiKey) else {
            throw ServiceError.missingKey
        }
        let trimmedKey = AppConfig.normalized(stored)
        let token = trimmedKey.hasPrefix("Bearer ")
            ? String(trimmedKey.dropFirst("Bearer ".count))
            : trimmedKey

        guard !token.isEmpty else {
            throw ServiceError.missingKey
        }

        let boundary = "Boundary-\(UUID().uuidString)"
        let body = try MultipartBuilder.makeMultipartBody(
            fileURL: audioURL,
            fieldName: "file",
            fileName: audioURL.lastPathComponent,
            mimeType: "audio/m4a",
            language: language,
            model: model,
            boundary: boundary
        )

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        request.httpBody = body

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw ServiceError.badResponse(-1)
        }
        guard 200..<300 ~= httpResponse.statusCode else {
            let details = String(data: data, encoding: .utf8)?.trimmingCharacters(in: .whitespacesAndNewlines)
            if httpResponse.statusCode == 401 || httpResponse.statusCode == 403 {
                throw ServiceError.unauthorized(details)
            }
            if httpResponse.statusCode == 503 {
                throw ServiceError.serviceUnavailable(details)
            }
            throw ServiceError.badResponse(httpResponse.statusCode)
        }

        do {
            let decoded = try JSONDecoder().decode(OpenAIWhisperResponse.self, from: data)
            return SLNGSTTResult(text: decoded.text, language: decoded.language)
        } catch {
            throw ServiceError.invalidPayload
        }
    }
}

private enum MultipartBuilder {
    static func makeMultipartBody(fileURL: URL,
                                 fieldName: String,
                                 fileName: String,
                                 mimeType: String,
                                 language: String?,
                                 model: String,
                                 boundary: String) throws -> Data {
        let audioData = try Data(contentsOf: fileURL)
        var body = Data()

        body.append(dataLine("--\(boundary)\r\n"))
        body.append(dataLine("Content-Disposition: form-data; name=\"model\"\r\n\r\n"))
        body.append(dataLine("\(model)\r\n"))

        body.append(dataLine("--\(boundary)\r\n"))
        body.append(dataLine("Content-Disposition: form-data; name=\"\(fieldName)\"; filename=\"\(fileName)\"\r\n"))
        body.append(dataLine("Content-Type: \(mimeType)\r\n\r\n"))
        body.append(audioData)
        body.append(dataLine("\r\n"))

        if let language {
            body.append(dataLine("--\(boundary)\r\n"))
            body.append(dataLine("Content-Disposition: form-data; name=\"language\"\r\n\r\n"))
            body.append(dataLine("\(language)\r\n"))
        }

        body.append(dataLine("--\(boundary)--\r\n"))
        return body
    }

    private static func dataLine(_ line: String) -> Data {
        return line.data(using: .utf8) ?? Data()
    }
}

private struct OpenAIWhisperResponse: Decodable {
    let text: String
    let language: String?
}
