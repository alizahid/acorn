import { useIsFocused } from '@react-navigation/native'
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
  type MenuElementConfig,
  type MenuState,
} from 'react-native-ios-context-menu'
import { type DynamicColor } from 'react-native-ios-utilities'

import arrowBendUpLeftDuotone from '~/assets/icons/arrow-bend-up-left-duotone.png'
import arrowFatDownDuotone from '~/assets/icons/arrow-fat-down-duotone.png'
import arrowFatUpDuotone from '~/assets/icons/arrow-fat-up-duotone.png'
import bookmarkSimpleDuotone from '~/assets/icons/bookmark-simple-duotone.png'
import boxArrowDownDuotone from '~/assets/icons/box-arrow-down-duotone.png'
import chartLineUpDuotone from '~/assets/icons/chart-line-up-duotone.png'
import chatCircleDuotone from '~/assets/icons/chat-circle-duotone.png'
import clockDuotone from '~/assets/icons/clock-duotone.png'
import compassDuotone from '~/assets/icons/compass-duotone.png'
import copyDuotone from '~/assets/icons/copy-duotone.png'
import downloadDuotone from '~/assets/icons/download-duotone.png'
import eyeClosedDuotone from '~/assets/icons/eye-closed-duotone.png'
import flagDuotone from '~/assets/icons/flag-duotone.png'
import flameDuotone from '~/assets/icons/flame-duotone.png'
import imageDuotone from '~/assets/icons/image-duotone.png'
import linkDuotone from '~/assets/icons/link-duotone.png'
import medalDuotone from '~/assets/icons/medal-duotone.png'
import packageDuotone from '~/assets/icons/package-duotone.png'
import pencilDuotone from '~/assets/icons/pencil-duotone.png'
import rankingDuotone from '~/assets/icons/ranking-duotone.png'
import shareDuotone from '~/assets/icons/share-duotone.png'
import swordDuotone from '~/assets/icons/sword-duotone.png'
import tagDuotone from '~/assets/icons/tag-duotone.png'
import targetDuotone from '~/assets/icons/target-duotone.png'
import textboxDuotone from '~/assets/icons/textbox-duotone.png'
import trashDuotone from '~/assets/icons/trash-duotone.png'
import userDuotone from '~/assets/icons/user-duotone.png'
import usersFourDuotone from '~/assets/icons/users-four-duotone.png'

const icons = {
  'arrow-bend-up-left-duotone': Image.resolveAssetSource(
    arrowBendUpLeftDuotone,
  ),
  'arrow-fat-down-duotone': Image.resolveAssetSource(arrowFatDownDuotone),
  'arrow-fat-up-duotone': Image.resolveAssetSource(arrowFatUpDuotone),
  'bookmark-simple-duotone': Image.resolveAssetSource(bookmarkSimpleDuotone),
  'box-arrow-down-duotone': Image.resolveAssetSource(boxArrowDownDuotone),
  'chart-line-up-duotone': Image.resolveAssetSource(chartLineUpDuotone),
  'chat-circle-duotone': Image.resolveAssetSource(chatCircleDuotone),
  'clock-duotone': Image.resolveAssetSource(clockDuotone),
  'compass-duotone': Image.resolveAssetSource(compassDuotone),
  'copy-duotone': Image.resolveAssetSource(copyDuotone),
  'download-duotone': Image.resolveAssetSource(downloadDuotone),
  'eye-closed-duotone': Image.resolveAssetSource(eyeClosedDuotone),
  'flag-duotone': Image.resolveAssetSource(flagDuotone),
  'flame-duotone': Image.resolveAssetSource(flameDuotone),
  'image-duotone': Image.resolveAssetSource(imageDuotone),
  'link-duotone': Image.resolveAssetSource(linkDuotone),
  'medal-duotone': Image.resolveAssetSource(medalDuotone),
  'package-duotone': Image.resolveAssetSource(packageDuotone),
  'pencil-duotone': Image.resolveAssetSource(pencilDuotone),
  'ranking-duotone': Image.resolveAssetSource(rankingDuotone),
  'share-duotone': Image.resolveAssetSource(shareDuotone),
  'sword-duotone': Image.resolveAssetSource(swordDuotone),
  'tag-duotone': Image.resolveAssetSource(tagDuotone),
  'target-duotone': Image.resolveAssetSource(targetDuotone),
  'textbox-duotone': Image.resolveAssetSource(textboxDuotone),
  'trash-duotone': Image.resolveAssetSource(trashDuotone),
  'user-duotone': Image.resolveAssetSource(userDuotone),
  'users-four-duotone': Image.resolveAssetSource(usersFourDuotone),
} as const

export type MenuIconName = keyof typeof icons

export type MenuIcon =
  | {
      color?: string
      name: MenuIconName
      type: 'icon'
    }
  | {
      image: ImageRequireSource
      type: 'image'
    }
  | {
      color?: string
      name: SFSymbol
      type: 'symbol'
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
  const menu = useRef<ContextMenuView>(null)

  const focused = useIsFocused()

  useEffect(() => {
    if (!focused) {
      void menu.current?.dismissMenu()
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

  return {
    actionKey: option.id,
    actionTitle: option.title,
    icon:
      option.icon?.type === 'symbol'
        ? {
            imageValue: {
              paletteColors: [option.icon.color ?? fallback],
              systemName: option.icon.name,
            },
            type: 'IMAGE_SYSTEM',
          }
        : option.icon?.type === 'icon'
          ? {
              imageOptions: {
                tint: option.icon.color ?? fallback,
              },
              imageValue: icons[option.icon.name],
              type: 'IMAGE_REQUIRE',
            }
          : option.icon?.type === 'image'
            ? {
                imageValue: Image.resolveAssetSource(option.icon.image),
                type: 'IMAGE_REQUIRE',
              }
            : undefined,
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
