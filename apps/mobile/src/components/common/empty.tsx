import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon, type IconName, type IconWeight } from './icon'
import { Text } from './text'
import { View } from './view'

type Props = {
  color?: string
  icon?: IconName
  message?: string
  weight?: IconWeight
}

export function Empty({ color, icon = 'SmileySad', message, weight }: Props) {
  const t = useTranslations('component.common.empty')

  const { theme } = useStyles()

  return (
    <View align="center" flexGrow={1} gap="4" justify="center" p="6">
      <Icon
        color={color ?? theme.colors.accent.accent}
        name={icon}
        size={theme.space[9]}
        weight={weight ?? (theme.name === 'dark' ? 'fill' : 'regular')}
      />

      <Text weight="medium">{message ?? t('message')}</Text>
    </View>
  )
}
