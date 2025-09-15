import ExpoModulesCore

public class ContextMenuModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ContextMenu")
        
        View(ContextMenuView.self) {
            Prop("options") { (view: ContextMenuView, options: [[String: Any]]?) in
                view.options = options
            }
            
            Prop("title") { (view: ContextMenuView, title: String?) in
                view.title = title
            }
            
            Prop("tappable") { (view: ContextMenuView, tappable: Bool) in
                view.tappable = tappable
            }
            
            AsyncFunction("hide") { (view: ContextMenuView) in
                view.hideMenu()
            }
            
            Events("onContextMenuPress", "onContextMenuPressPreview")
        }
    }
}
