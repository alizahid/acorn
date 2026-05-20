import ExpoModulesCore
import HXPhotoPicker

struct GalleryAction: Record {
  @Field var id: String = ""
  @Field var icon: String = ""
}

struct GalleryImage: Record {
  @Field var url: String = ""
  @Field var thumbnail: String? = nil
}

struct GalleryOpenProps: Record {
  @Field var images: [GalleryImage] = []
  @Field var index: Int? = nil
  @Field var actions: [GalleryAction]? = nil
  @Field var theme: String = ""
}

public class GalleryModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Gallery")

    Events("onAction")

    OnCreate {
      PickerConfiguration.imageViewProtocol = SDImageView.self
    }

    Function("open") { (props: GalleryOpenProps) -> Void in
      GalleryPresenter.open(
        theme: props.theme,
        images: props.images,
        index: props.index ?? 0,
        actions: props.actions ?? [],
        onAction: { [weak self] id, url in
          self?.sendEvent("onAction", ["id": id, "url": url])
        }
      )
    }
  }
}
