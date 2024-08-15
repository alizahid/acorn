import { type ReactElement } from 'react'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type IconName, type IconWeight } from '~/components/common/icon'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { type Insets, useCommon } from '~/hooks/common'

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
  insets: Insets
  items: Array<SettingsItem | string | null>
  onRefresh?: () => Promise<unknown>
}

export function SettingsMenu({
  footer,
  header,
  insets = [],
  items,
  onRefresh,
}: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const props = common.listProps(insets)

  return (
    <FlatList
      {...props}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      data={items}
      keyExtractor={(item, index) => String(index)}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            offset={props.progressViewOffset}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      renderItem={({ index, item }) => {
        if (item === null) {
          return <View style={styles.separator} />
        }

        if (typeof item === 'string') {
          return (
            <View style={[styles.header]}>
              <Text highContrast={false} size="2" weight="medium">
                {item}
              </Text>
            </View>
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
  header: {
    marginHorizontal: theme.space[3],
    marginVertical: theme.space[3],
  },
  last: {
    marginBottom: theme.space[1],
  },
  separator: {
    height: theme.space[4],
  },
}))
