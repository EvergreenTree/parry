import Foundation

enum AppConfig {
    enum Keys {
        static let pioneerApiKey = "PIONEER_API_KEY"
        static let openAIApiKey = "OPENAI_API_KEY"
        static let slngApiKey = "SLNG_API_KEY"
        static let falApiKey = "FAL_API_KEY"
    }

    static var pioneerApiKey: String {
        if let fromInfo = Bundle.main.object(forInfoDictionaryKey: Keys.pioneerApiKey) as? String,
           !normalized(fromInfo).isEmpty,
           !fromInfo.contains("THE_TOKEN") {
            return normalized(fromInfo)
        }
        return normalized(KeychainStore.shared.load(for: Keys.pioneerApiKey))
    }

    static var speechApiKey: String {
        let direct = normalized(KeychainStore.shared.load(for: Keys.openAIApiKey))
        if !direct.isEmpty { return direct }
        return normalized(KeychainStore.shared.load(for: Keys.slngApiKey))
    }

    static func keyStatusText(_ key: String) -> String {
        return normalized(key).isEmpty ? "Not configured" : "Configured"
    }

    static func normalized(_ value: String?) -> String {
        return value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }
}
