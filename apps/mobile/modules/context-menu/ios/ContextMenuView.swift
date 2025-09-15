import ExpoModulesCore
import UIKit

class ContextMenuView: ExpoView {
    private var contextMenuInteraction: UIContextMenuInteraction?
    private var menuButton: UIButton?
    
    // Events
    let onContextMenuPress = EventDispatcher()
    let onContextMenuPressPreview = EventDispatcher()
    
    // Props
    var options: [[String: Any]]?
    var title: String?
    var tappable: Bool = false {
        didSet {
            updateInteractionMode()
        }
    }
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
        setupContextMenuInteraction()
    }
    
    deinit {
        cleanupInteractions()
    }
    
    private func cleanupInteractions() {
        if let interaction = contextMenuInteraction {
            removeInteraction(interaction)
            contextMenuInteraction = nil
        }
        menuButton?.removeFromSuperview()
        menuButton = nil
    }
    
    private func setupContextMenuInteraction() {
        guard contextMenuInteraction == nil else { return }
        
        let interaction = UIContextMenuInteraction(delegate: self)
        addInteraction(interaction)
        contextMenuInteraction = interaction
    }
    
    private func setupMenuButton() {
        menuButton?.removeFromSuperview()
        
        let button = UIButton(type: .system)
        button.frame = bounds
        button.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        button.backgroundColor = UIColor.clear
        button.showsMenuAsPrimaryAction = true
        button.menu = createMenu()
        
        addSubview(button)
        menuButton = button
    }
    
    private func updateInteractionMode() {
        if tappable {
            // Remove context menu interaction and setup button
            if let interaction = contextMenuInteraction {
                removeInteraction(interaction)
                contextMenuInteraction = nil
            }
            setupMenuButton()
        } else {
            // Remove button and setup context menu interaction
            menuButton?.removeFromSuperview()
            menuButton = nil
            setupContextMenuInteraction()
        }
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        menuButton?.frame = bounds
    }
    
    func hideMenu() {
        contextMenuInteraction?.dismissMenu()
    }
    
    private func createMenu() -> UIMenu? {
        guard let options = options, !options.isEmpty else { return nil }
        return createUIMenu(from: options, title: title)
    }
    
    private func createUIAction(from actionData: [String: Any]) -> UIAction? {
        guard let id = actionData["id"] as? String,
              let title = actionData["title"] as? String else {
            return nil
        }
        
        // Parse state
        let state: UIMenuElement.State = {
            guard let stateString = actionData["state"] as? String else { return .off }
            switch stateString {
            case "on": return .on
            case "mixed": return .mixed
            default: return .off
            }
        }()
        
        // Build attributes
        var attributes: UIMenuElement.Attributes = []
        if actionData["disabled"] as? Bool == true {
            attributes.insert(.disabled)
        }
        if actionData["destructive"] as? Bool == true {
            attributes.insert(.destructive)
        }
        
        // Process image and color
        var image: UIImage?
        if let iconName = actionData["icon"] as? String {
            image = UIImage(systemName: iconName)
            
            if let colorValue = actionData["color"] as? NSNumber,
               let baseImage = image {
                let color = UIColor(red: CGFloat((colorValue.intValue & 0xFF0000) >> 16) / 255.0,
                                    green: CGFloat((colorValue.intValue & 0x00FF00) >> 8) / 255.0,
                                    blue: CGFloat(colorValue.intValue & 0x0000FF) / 255.0,
                                    alpha: 1.0)
                image = baseImage.withTintColor(color, renderingMode: .alwaysOriginal)
            }
        }
        
        return UIAction(
            title: title,
            image: image,
            identifier: UIAction.Identifier(id),
            discoverabilityTitle: nil,
            attributes: attributes,
            state: state
        ) { [weak self] _ in
            self?.onContextMenuPress(["id": id])
        }
    }
    
    private func createUIMenu(from optionsData: [[String: Any]], title: String? = nil) -> UIMenu {
        let menuElements: [UIMenuElement] = optionsData.compactMap { optionData in
            if let nestedOptions = optionData["options"] as? [[String: Any]], !nestedOptions.isEmpty {
                // Create submenu
                let submenuTitle = optionData["title"] as? String ?? ""
                let submenu = createUIMenu(from: nestedOptions, title: submenuTitle)
                
                let submenuOptions: UIMenu.Options = (optionData["inline"] as? Bool == true) ? .displayInline : []
                
                return UIMenu(
                    title: submenuTitle,
                    options: submenuOptions,
                    children: submenu.children
                )
            } else {
                // Create regular action
                return createUIAction(from: optionData)
            }
        }
        
        return UIMenu(title: title ?? "", children: menuElements)
    }
}

// MARK: - UIContextMenuInteractionDelegate
extension ContextMenuView: UIContextMenuInteractionDelegate {
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        configurationForMenuAtLocation location: CGPoint
    ) -> UIContextMenuConfiguration? {
        return UIContextMenuConfiguration(identifier: nil, previewProvider: nil) { [weak self] _ in
            return self?.createMenu()
        }
    }
    
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        willPerformPreviewActionForMenuWith configuration: UIContextMenuConfiguration,
        animator: UIContextMenuInteractionCommitAnimating
    ) {
        onContextMenuPressPreview([:])
    }
    
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        previewForHighlightingMenuWithConfiguration configuration: UIContextMenuConfiguration
    ) -> UITargetedPreview? {
        // Return nil to prevent crashes when React view changes
        return nil
    }
    
    func contextMenuInteraction(
        _ interaction: UIContextMenuInteraction,
        previewForDismissingMenuWithConfiguration configuration: UIContextMenuConfiguration
    ) -> UITargetedPreview? {
        // Return nil to prevent crashes when React view changes
        return nil
    }
}
