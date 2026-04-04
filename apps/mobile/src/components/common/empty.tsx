import { type SFSymbol } from 'expo-symbols'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/tokens'

import { Icon } from './icon'
import { Text } from './text'

type Props = {
  color?: ColorToken
  icon?: SFSymbol
  message?: string
}

export function Empty({
  color = 'accent',
  icon = 'face.dashed.fill',
  message,
}: Props) {
  const t = useTranslations('component.common.empty')

  return (
    <View style={styles.main}>
      <Icon
        name={icon}
        uniProps={(theme) => ({
          size: theme.space[9],
          tintColor: theme.colors[color].accent,
        })}
      />

      <Text weight="medium">{message ?? t('message')}</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
    marginVertical: theme.space[9],
    padding: theme.space[4],
  },
}))
