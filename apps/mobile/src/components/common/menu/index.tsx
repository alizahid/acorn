import { useScrollToTop } from '@react-navigation/native'
import { type SFSymbol } from 'expo-symbols'
import { type ReactElement, useRef } from 'react'
import { FlatList } from 'react-native'
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
  left?: ReactElement
  right?: ReactElement
  value: string
}

export type MenuItem = {
  arrow?: boolean
  description?: string
  icon?: Icon
  label: string
  onPress?: () => void | Promise<void>
} & (
  | {
      type?: undefined
    }
  | {
      onSelect: (value: string) => void
      options: Array<MenuItemOption>
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
  items: Array<MenuItem | string | null>
  listProps?: ListProps
  onRefresh?: () => Promise<unknown>
}

export function Menu({ footer, header, items, listProps, onRefresh }: Props) {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlatList<MenuItem | string | null>>(null)

  useScrollToTop(list)

  return (
    <FlatList
      {...listProps}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      data={items}
      getItemLayout={(_, index) => ({
        index,
        length: 48,
        offset: index * 48,
      })}
      initialNumToRender={items.length}
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

        return (
          <MenuItem
            item={item}
            style={[
              index === 0 && styles.first,
              index === items.length - 1 && styles.last,
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
