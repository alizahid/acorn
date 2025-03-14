import { type SFSymbol } from 'expo-symbols'
import { type ReactElement, useRef } from 'react'
import {
  FlatList,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { type ListProps } from '~/hooks/list'
import { useScrollToTop } from '~/hooks/scroll-top'

import { type IconName, type IconWeight } from '../icon'
import { MenuItem } from './item'

type Item = MenuItem | string | null | (() => ReactElement)

type Icon =
  | {
      color?: string
      name: SFSymbol
      type: 'symbol'
    }
  | {
      color?: string
      name: IconName
      type: 'icon'
      weight?: IconWeight
    }

export type MenuItemOption = {
  hideRight?: boolean
  icon?: Icon
  label: string
  labelStyle?: StyleProp<TextStyle>
  left?: ReactElement
  right?: ReactElement
  style?: StyleProp<ViewStyle>
  value: string
}

export type MenuItem = {
  arrow?: boolean
  description?: string
  hideSelected?: boolean
  icon?: Icon
  label: string
  labelStyle?: StyleProp<TextStyle>
  onPress?: () => void | Promise<void>
  style?: StyleProp<ViewStyle>
} & (
  | {
      type?: undefined
    }
  | {
      onSelect: (value: string) => void
      options: Array<MenuItemOption | string | null>
      title?: string
      type: 'options'
      value?: string
    }
  | {
      onSelect: (value: boolean) => void
      type: 'switch'
      value: boolean
    }
)

type Props = {
  footer?: ReactElement
  header?: ReactElement
  items: Array<Item>
  listProps?: ListProps<Item>
  onRefresh?: () => Promise<unknown>
  style?: StyleProp<ViewStyle>
}

export function Menu({
  footer,
  header,
  items,
  listProps,
  onRefresh,
  style,
}: Props) {
  const list = useRef<FlatList<Item>>(null)

  useScrollToTop(list, listProps)

  const { styles } = useStyles(stylesheet)

  return (
    <FlatList
      {...listProps}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      contentContainerStyle={[styles.content, style]}
      data={items}
      initialNumToRender={100}
      keyExtractor={(item, index) => String(index)}
      ref={list}
      refreshControl={
        onRefresh ? <RefreshControl onRefresh={onRefresh} /> : undefined
      }
      renderItem={({ item }) => {
        if (item === null) {
          return <View height="4" />
        }

        if (typeof item === 'string') {
          return (
            <Text
              highContrast={false}
              mb="2"
              mt="3"
              mx="3"
              size="2"
              weight="medium"
            >
              {item}
            </Text>
          )
        }

        if (typeof item === 'function') {
          return item()
        }

        return <MenuItem item={item} style={item.style} />
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    paddingVertical: theme.space[1],
  },
}))
