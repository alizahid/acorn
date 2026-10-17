import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/tokens'

import { Text } from '../common/text'
import { type ChangelogType } from './changelog'

type Props = {
  items: Array<string>
  type: ChangelogType
}

export function ChangelogItems({ items, type }: Props) {
  const t = useTranslations('component.changelog')

  return (
    <View style={styles.main}>
      <Text color={colors[type]} highContrast size="2" weight="bold">
        {t(type)}
      </Text>

      {items.map((item) => (
        <View key={item} style={styles.item}>
          <View style={styles.side}>
            <View style={styles.bullet(colors[type])} />
          </View>

          <Text selectable size="2" style={styles.label}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  bullet: (color: ColorToken) => ({
    backgroundColor: theme.colors[color].accent,
    borderCurve: 'continuous',
    borderRadius: 1,
    height: 6,
    width: 6,
  }),
  item: {
    flexDirection: 'row',
    gap: theme.space[1],
  },
  label: {
    flex: 1,
  },
  main: {
    gap: theme.space[2],
  },
  side: {
    alignItems: 'center',
    height: theme.typography[2].lineHeight,
    justifyContent: 'center',
    width: theme.typography[2].lineHeight,
  },
}))

const colors: Record<ChangelogType, ColorToken> = {
  added: 'green',
  changed: 'blue',
  fixed: 'green',
  removed: 'orange',
}
