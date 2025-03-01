import { useScrollToTop } from '@react-navigation/native'
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

import { type IconName, type IconWeight } from '../icon'
import { MenuItem } from './item'

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
  items: Array<MenuItem | string | null | (() => ReactElement)>
  listProps?: ListProps
  onRefresh?: () => Promise<unknown>
}

export function Menu({ footer, header, items, listProps, onRefresh }: Props) {
  const { styles } = useStyles(stylesheet)

  const list =
    useRef<FlatList<MenuItem | string | null | (() => ReactElement)>>(null)

  useScrollToTop(list)

  return (
    <FlatList
      {...listProps}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      data={items}
      keyExtractor={(item, index) => String(index)}
      ref={list}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            offset={listProps?.progressViewOffset}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      renderItem={({ index, item }) => {
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

        return (
          <MenuItem
            item={item}
            style={[
              index === 0 && styles.first,
              index === items.length - 1 && styles.last,
              item.style,
            ]}
          />
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  first: {
    marginTop: theme.space[1],
  },
  last: {
    marginBottom: theme.space[1],
  },
}))
