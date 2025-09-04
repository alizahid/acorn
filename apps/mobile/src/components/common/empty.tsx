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

  return (
    <View align="center" gap="4" justify="center" my="9" p="4">
      <Icon
        name={icon}
        uniProps={(theme) => ({
          color: color ?? theme.colors.accent.accent,
          size: theme.space[9],
          weight: weight ?? (theme.variant === 'dark' ? 'fill' : 'regular'),
        })}
      />

      <Text weight="medium">{message ?? t('message')}</Text>
    </View>
  )
}
