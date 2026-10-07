import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/tokens'

import { Icon, type IconName } from './icon'
import { Text } from './text'

type Props = {
  color?: ColorToken
  icon?: IconName
  message?: string
  style?: StyleProp<ViewStyle>
}

export function Empty({
  color = 'accent',
  icon = 'moon-stars',
  message,
  style,
}: Props) {
  const t = useTranslations('component.common.empty')

  return (
    <View style={[styles.main, style]}>
      <Icon
        name={icon}
        uniProps={(theme) => ({
          color: theme.colors[color].accent,
          size: theme.space[8] * 2,
        })}
      />

      <Text weight="medium">{message ?? t('message')}</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  main: {
    alignItems: 'center',
    gap: theme.space[4],
    height: runtime.screen.height * 0.6,
    justifyContent: 'center',
    padding: theme.space[4],
  },
}))
