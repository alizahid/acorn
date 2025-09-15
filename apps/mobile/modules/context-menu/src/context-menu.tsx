import { requireNativeView } from 'expo'
import type * as React from 'react'
import { processColor } from 'react-native'

import {
  type ContextMenuAction,
  type ContextMenuProps,
  type OnPressEventPayload,
} from './types'

type Props = Omit<ContextMenuProps, 'onPress' | 'onPressPreview'> & {
  onContextMenuPress?: (event: { nativeEvent: OnPressEventPayload }) => void
  onContextMenuPressPreview?: () => void
}

const NativeView: React.ComponentType<Props> = requireNativeView('ContextMenu')

export function ContextMenu({
  accessibilityLabel,
  children,
  onPressPreview,
  ref,
  options,
  style,
  tappable,
  title,
}: ContextMenuProps) {
  return (
    <NativeView
      accessibilityLabel={accessibilityLabel}
      onContextMenuPress={(event) => {
        const option = findOption(event.nativeEvent.id, options)

        option?.onPress?.()
      }}
      onContextMenuPressPreview={onPressPreview}
      options={options?.map((option) => transform(option))}
      ref={ref}
      style={style}
      tappable={tappable}
      title={title}
    >
      {children}
    </NativeView>
  )
}

function transform(option: ContextMenuAction): ContextMenuAction {
  return {
    ...option,
    color: option.color
      ? (processColor(option.color) as unknown as string)
      : undefined,
    options: option.options?.map((item) => transform(item)),
  }
}

function findOption(
  id: string,
  options?: Array<ContextMenuAction>,
): ContextMenuAction | undefined {
  if (!options) {
    return
  }

  for (const option of options) {
    if (option.id === id) {
      return option
    }

    if (option.options) {
      const exists = findOption(id, option.options)

      if (exists) {
        return exists
      }
    }
  }
}
