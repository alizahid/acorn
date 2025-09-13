import { type SFSymbol } from 'expo-symbols'
import { useTranslations } from 'use-intl'

import { type ColorToken } from '~/styles/tokens'

import { Icon } from './icon'
import { Text } from './text'
import { View } from './view'

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
    <View align="center" gap="4" justify="center" my="9" p="4">
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
