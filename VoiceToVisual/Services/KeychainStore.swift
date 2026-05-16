import Foundation
import Security

final class KeychainStore {
    enum KeychainError: Error {
        case invalidData
        case keychainError(OSStatus)
    }

    static let shared = KeychainStore()
    private init() {}

    private let service = "com.parry.voice-to-visual"

    func save(_ value: String, for account: String) throws {
        guard let data = value.data(using: .utf8) else {
            throw KeychainError.invalidData
        }

        let baseQuery: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]

        var status = SecItemCopyMatching(baseQuery as CFDictionary, nil)
        if status == errSecSuccess {
            let update = [kSecValueData as String: data]
            status = SecItemUpdate(baseQuery as CFDictionary, update as CFDictionary)
        } else if status == errSecItemNotFound {
            var addQuery = baseQuery
            addQuery[kSecValueData as String] = data
            addQuery[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock
            status = SecItemAdd(addQuery as CFDictionary, nil)
        }

        guard status == errSecSuccess else {
            throw KeychainError.keychainError(status)
        }
    }

    func load(for account: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne,
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)
        guard status == errSecSuccess else { return nil }

        guard let data = item as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    func delete(for account: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account,
        ]
        SecItemDelete(query as CFDictionary)
    }
}
