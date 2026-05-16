import Foundation

struct SLNGSTTResult: Decodable {
    let text: String
    let language: String?
}

enum PioneerMode: String, Sendable {
    case reasoning = "reasoning"
    case imagePrompt = "image_prompt"
}

struct PioneerCompletionResult: Sendable {
    let analysisText: String
    let imagePrompt: String
}

struct FalImageResult: Decodable, Sendable {
    let url: String
    let requestId: String?
    let seed: Int?
    let nsfw: Bool?

    init(url: String, requestId: String? = nil, seed: Int? = nil, nsfw: Bool? = nil) {
        self.url = url
        self.requestId = requestId
        self.seed = seed
        self.nsfw = nsfw
    }

    init?(json: [String: Any]) {
        if let imageUrl = Self.extractImageUrl(from: json) {
            self.url = imageUrl
        } else {
            return nil
        }
        self.requestId = json["requestId"] as? String ?? json["request_id"] as? String
        self.seed = json["seed"] as? Int
        self.nsfw = json["nsfw"] as? Bool
    }

    private static func extractImageUrl(from json: [String: Any]) -> String? {
        if let images = json["images"] as? [[String: Any]], let first = images.first {
            if let url = first["url"] as? String { return url }
            if let b64 = first["base64"] as? String {
                return "data:image/png;base64,\(b64)"
            }
        }

        if let output = json["output"] as? [String: Any], let images = output["images"] as? [[String: Any]] {
            if let first = images.first {
                return first["url"] as? String
            }
        }

        if let data = json["data"] as? [String: Any], let images = data["images"] as? [[String: Any]] {
            if let first = images.first {
                return first["url"] as? String
            }
        }

        if let image = json["image"] as? String {
            return image
        }

        return nil
    }
}

struct PioneerChatRequest: Encodable {
    let model: String
    let messages: [PioneerChatMessage]
    let stream: Bool = false

    struct PioneerChatMessage: Encodable {
        let role: String
        let content: String
    }
}

struct PioneerChatResponse: Decodable {
    struct Choice: Decodable {
        let message: Message
    }

    struct Message: Decodable {
        let role: String
        let content: String
    }

    let choices: [Choice]
}
