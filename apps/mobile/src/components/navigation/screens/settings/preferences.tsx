import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SettingsMenu } from '~/components/settings/menu'
import { usePreferences } from '~/stores/preferences'

export function SettingsPreferencesScreen() {
  const t = useTranslations('screen.settings.preferences')

  const { update, ...preferences } = usePreferences()

  const { theme } = useStyles()

  return (
    <SettingsMenu
      items={(
        [
          {
            color: theme.colors.plum.a9,
            icon: 'SpeakerSimpleX',
            key: 'feedMuted',
          },
          {
            color: theme.colors.red.a9,
            icon: 'EyeClosed',
            key: 'blurNsfw',
          },
          {
            color: theme.colors.indigo.a9,
            icon: 'Browser',
            key: 'linkBrowser',
          },
          {
            color: theme.colors.jade.a9,
            icon: 'TextAa',
            key: 'fontScaling',
          },
        ] as const
      ).map((item) => ({
        icon: {
          color: item.color,
          name: item.icon,
        },
        label: t(`menu.${item.key}`),
        onSelect(value) {
          update({
            [item.key]: value,
          })
        },
        type: 'switch',
        value: preferences[item.key],
      }))}
    />
  )
}
