import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon, type IconName } from './icon'
import { Text } from './text'
import { View } from './view'

type Props = {
  color?: string
  icon?: IconName
  message?: string
}

export function Empty({ color, icon = 'Empty', message }: Props) {
  const t = useTranslations('component.common.empty')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View align="center" gap="4" justify="center" px="6" style={styles.main}>
      <Icon
        color={color ?? theme.colors.accent.a9}
        name={icon}
        size={theme.space[9]}
      />

      <Text weight="medium">{message ?? t('message')}</Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  main: {
    paddingVertical: runtime.screen.height * 0.2,
  },
}))
