import { useScrollToTop } from '@react-navigation/native'
import { type ReactElement, useRef } from 'react'
import { FlatList } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type IconName, type IconWeight } from '~/components/common/icon'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { listProps } from '~/lib/common'

import { SettingsItem } from './item'

type Icon = {
  color?: string
  name: IconName
  weight?: IconWeight
}

export type SettingsItemOption = {
  icon?: Icon
  label: string
  left?: ReactElement
  right?: ReactElement
  value: string
}

export type SettingsItem = {
  arrow?: boolean
  icon?: Icon
  label: string
  onPress?: () => void
} & (
  | {
      type?: undefined
    }
  | {
      onSelect: (value: string) => void
      options: Array<SettingsItemOption>
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
  items: Array<SettingsItem | string | null>
  onRefresh?: () => Promise<unknown>
}

export function SettingsMenu({ footer, header, items, onRefresh }: Props) {
  const { styles } = useStyles(stylesheet)

  const list = useRef<FlatList<SettingsItem | string | null>>(null)

  useScrollToTop(list)

  return (
    <FlatList
      {...listProps}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      data={items}
      initialNumToRender={items.length}
      keyExtractor={(item, index) => String(index)}
      ref={list}
      refreshControl={
        onRefresh ? <RefreshControl onRefresh={onRefresh} /> : undefined
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
          <SettingsItem
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
