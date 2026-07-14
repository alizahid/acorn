import ExpoModulesCore
import UIKit

public class HelpersModule: Module {
    private var geometryObservation: NSKeyValueObservation?
    private var windowObserver: NSObjectProtocol?
    private var pendingEmit: DispatchWorkItem?
    private var lastInsets: [String: CGFloat]?

    public func definition() -> ModuleDefinition {
        Name("Helpers")

        Events("onCornerInsetsChange")

        Function("getCornerInsets") { () -> [String: CGFloat] in
            if Thread.isMainThread {
                return Self.measureCornerInsets()
            }

            return DispatchQueue.main.sync {
                Self.measureCornerInsets()
            }
        }

        OnStartObserving("onCornerInsetsChange") {
            DispatchQueue.main.async {
                self.startObserving()
            }
        }

        OnStopObserving("onCornerInsetsChange") {
            DispatchQueue.main.async {
                self.stopObserving()
            }
        }

        OnDestroy {
            DispatchQueue.main.async {
                self.stopObserving()
            }
        }
    }

    private func startObserving() {
        observeScene()

        windowObserver = NotificationCenter.default.addObserver(
            forName: UIWindow.didBecomeKeyNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.observeScene()
            self?.scheduleEmit()
        }
    }

    private func stopObserving() {
        geometryObservation?.invalidate()
        geometryObservation = nil

        if let windowObserver {
            NotificationCenter.default.removeObserver(windowObserver)
        }

        windowObserver = nil

        pendingEmit?.cancel()
        pendingEmit = nil
    }

    private func observeScene() {
        geometryObservation?.invalidate()

        guard let scene = Self.keyWindow?.windowScene else {
            return
        }

        geometryObservation = scene.observe(\.effectiveGeometry) { [weak self] _, _ in
            DispatchQueue.main.async {
                self?.scheduleEmit()
            }
        }
    }

    /// Window geometry KVO fires in bursts during a resize; coalesce and give
    /// UIKit a beat to update the corner margins before measuring.
    private func scheduleEmit() {
        pendingEmit?.cancel()

        let work = DispatchWorkItem { [weak self] in
            self?.emitIfChanged()
        }

        pendingEmit = work

        DispatchQueue.main.asyncAfter(deadline: .now() + 0.05, execute: work)
    }

    private func emitIfChanged() {
        let insets = Self.measureCornerInsets()

        if insets == lastInsets {
            return
        }

        lastInsets = insets

        sendEvent("onCornerInsetsChange", insets)
    }

    private static var keyWindow: UIWindow? {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .flatMap(\.windows)
            .first(where: \.isKeyWindow)
    }

    private static func measureCornerInsets() -> [String: CGFloat] {
        #if os(iOS)
            guard #available(iOS 26.0, *), let window = keyWindow else {
                return ["left": 0, "right": 0]
            }

            window.setNeedsUpdateProperties()
            window.updatePropertiesIfNeeded()

            let adapted = window.edgeInsets(for: .margins(cornerAdaptation: .horizontal))
            let baseline = window.edgeInsets(for: .margins(cornerAdaptation: .none))

            return [
                "left": adapted.left == baseline.left ? 0 : adapted.left,
                "right": adapted.right == baseline.right ? 0 : adapted.right,
            ]
        #else
            return ["left": 0, "right": 0]
        #endif
    }
}
