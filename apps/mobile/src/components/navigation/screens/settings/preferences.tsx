import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SettingsMenu } from '~/components/settings/menu'
import { usePreferences } from '~/stores/preferences'

export function SettingsPreferencesScreen() {
  const t = useTranslations('screen.settings.preferences')

  const { blurNsfw, feedMuted, linkBrowser, update } = usePreferences()

  const { theme } = useStyles()

  return (
    <SettingsMenu
      items={[
        {
          icon: {
            color: theme.colors.plum.a9,
            name: 'SpeakerSimpleX',
          },
          label: t('menu.muted'),
          onSelect(value) {
            update({
              feedMuted: value,
            })
          },
          type: 'switch',
          value: feedMuted,
        },
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'EyeClosed',
          },
          label: t('menu.nsfw'),
          onSelect(value) {
            update({
              blurNsfw: value,
            })
          },
          type: 'switch',
          value: blurNsfw,
        },
        {
          icon: {
            color: theme.colors.indigo.a9,
            name: 'Browser',
          },
          label: t('menu.browser'),
          onSelect(value) {
            update({
              linkBrowser: value,
            })
          },
          type: 'switch',
          value: linkBrowser,
        },
      ]}
    />
  )
}
