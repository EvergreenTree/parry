import SwiftUI

struct FullImageView: View {
    let imageURL: URL

    var body: some View {
        AsyncImage(url: imageURL) { phase in
            switch phase {
            case .empty:
                ProgressView()
            case .success(let img):
                img.resizable()
                    .scaledToFit()
                    .navigationTitle("Generated image")
                    .navigationBarTitleDisplayMode(.inline)
                    .padding()
            case .failure:
                VStack {
                    Image(systemName: "photo.fill")
                    Text("Unable to load image")
                }
            @unknown default:
                EmptyView()
            }
        }
    }
}
