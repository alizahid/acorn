import { type SFSymbol } from 'expo-symbols'
import { compact } from 'lodash'
import { type ReactNode, useEffect, useMemo, useRef } from 'react'
import {
  Image,
  type ImageRequireSource,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import {
  ContextMenuButton,
  ContextMenuView,
  type IconConfig,
  type MenuElementConfig,
  type MenuState,
} from 'react-native-ios-context-menu'
import {
  type DynamicColor,
  type ImageItemConfig,
} from 'react-native-ios-utilities'

import { useFocused } from '~/hooks/focus'

export type MenuIcon =
  | {
      image: ImageRequireSource
    }
  | {
      color?: string
      name: SFSymbol
    }

export type MenuOption = {
  action?: () => void
  destructive?: boolean
  disabled?: boolean
  icon?: MenuIcon
  id: string
  inline?: boolean
  options?: Array<MenuOption>
  state?: MenuState
  title: string
}

type Props = {
  children: ReactNode
  hitSlop?: number | Insets
  label: string
  onPress?: () => void
  options: Array<MenuOption>
  style?: StyleProp<ViewStyle>
  tap?: boolean
}

export function ContextMenu({
  children,
  hitSlop,
  label,
  onPress,
  options,
  style,
  tap = false,
}: Props) {
  const { focused } = useFocused()

  const menu = useRef<ContextMenuView>(null)

  useEffect(() => {
    if (!focused) {
      menu.current?.dismissMenu()
    }
  }, [focused])

  const actions = useMemo(
    () => options.map((option) => transformOption(option)),
    [options],
  )

  const Component = tap ? ContextMenuButton : ContextMenuView

  return (
    <Component
      accessibilityLabel={label}
      hitSlop={hitSlop}
      menuConfig={{
        menuItems: actions,
        menuTitle: '',
      }}
      onPressMenuItem={(event) => {
        const action = findAction(options, event.nativeEvent.actionKey)

        action?.()
      }}
      onPressMenuPreview={onPress}
      ref={menu}
      shouldWaitForMenuToHideBeforeFiringOnPressMenuItem={false}
      style={style}
    >
      {children}
    </Component>
  )
}

function transformOption(option: MenuOption): MenuElementConfig {
  const fallback: DynamicColor = {
    dark: '#fff',
    light: '#000',
  }

  const icon: IconConfig | ImageItemConfig | undefined =
    option.icon && 'name' in option.icon
      ? {
          imageValue: {
            paletteColors: [option.icon.color ?? fallback],
            systemName: option.icon.name,
          },
          type: 'IMAGE_SYSTEM',
        }
      : option.icon && 'image' in option.icon
        ? {
            imageValue: Image.resolveAssetSource(option.icon.image),
            type: 'IMAGE_REQUIRE',
          }
        : undefined

  return {
    actionKey: option.id,
    actionTitle: option.title,
    icon,
    menuAttributes: compact([
      option.destructive && 'destructive',
      option.disabled && 'disabled',
    ]),
    menuItems: option.options?.map((item) => transformOption(item)),
    menuOptions: compact([option.inline && 'displayInline']),
    menuState: option.state,
    menuTitle: option.options ? option.title : undefined,
  }
}

function findAction(
  options: Array<MenuOption>,
  id: string,
): (() => void) | undefined {
  for (const option of options) {
    if (option.id === id) {
      return option.action
    }

    if (option.options) {
      const exists = findAction(option.options, id)

      if (exists) {
        return exists
      }
    }
  }
}
