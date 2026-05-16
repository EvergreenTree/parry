import Foundation

final class FalService {
    enum Error: LocalizedError {
        case missingKey
        case badResponse(Int)
        case invalidPayload

        var errorDescription: String? {
            switch self {
            case .missingKey:
                return "fal key missing. Configure it in Settings."
            case .badResponse(let code):
                return "fal returned HTTP \(code)."
            case .invalidPayload:
                return "fal response format is not recognized."
            }
        }
    }

    private let endpoint: URL

    init(model: String = "fal-ai/flux/schnell") {
        endpoint = URL(string: "https://fal.run/\(model)")!
    }

    func generateImage(prompt: String, key: String) async throws -> FalImageResult {
        guard !key.isEmpty else { throw Error.missingKey }

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("Key \(key)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let payload: [String: Any] = [
            "prompt": prompt,
            "num_images": 1
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: payload)

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw Error.badResponse(-1)
        }
        guard 200..<300 ~= httpResponse.statusCode else {
            throw Error.badResponse(httpResponse.statusCode)
        }

        let json = try JSONSerialization.jsonObject(with: data)
        guard let dict = json as? [String: Any], let model = FalImageResult(json: dict) else {
            throw Error.invalidPayload
        }

        return model
    }
}
