import HXPhotoPicker
import UIKit

enum GalleryPresenter {
  static func open(
    theme: String,
    images: [String],
    index: Int,
    actions: [GalleryAction],
    onAction: @escaping (String, String) -> Void
  ) {
    let assets: [PhotoAsset] = images.compactMap { path -> PhotoAsset? in
      let url = URL(string: path)

      return PhotoAsset(
        NetworkImageAsset(
          thumbnailURL: url,
          originalURL: url
        ))
    }

    guard !assets.isEmpty else {
      return
    }

    var config = HXPhotoPicker.PhotoBrowser.Configuration()

    config.showDelete = false
    config.backgroundColor = theme == "dark" ? .black : .white
    config.tintColor = theme == "dark" ? .white : .black

    DispatchQueue.main.async {
      let browser = HXPhotoPicker.PhotoBrowser.show(
        assets,
        pageIndex: max(0, min(index, assets.count - 1)),
        config: config
      )

      if !actions.isEmpty {
        let items = actions.compactMap { action -> UIBarButtonItem? in
          guard let image = UIImage(systemName: action.icon) else {
            return nil
          }

          return UIBarButtonItem(
            primaryAction: UIAction(image: image) { [weak browser] _ in
              if let url = browser?.currentAsset?.networkImageAsset?.originalURL?.absoluteString {
                onAction(action.id, url)
              }
            }
          )
        }

        browser.previewViewController?.navigationItem.rightBarButtonItems = items.reversed()
      }
    }
  }
}
