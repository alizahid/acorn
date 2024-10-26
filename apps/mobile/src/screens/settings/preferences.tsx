import { useTranslations } from 'use-intl'

import { Menu } from '~/components/common/menu'
import { usePreferences } from '~/stores/preferences'

export function SettingsPreferencesScreen() {
  const t = useTranslations('screen.settings.preferences')

  const { update, ...preferences } = usePreferences()

  return (
    <Menu
      items={(
        [
          t('menu.browsing'),
          {
            icon: 'SpeakerSimpleX',
            key: 'feedMuted',
          },
          {
            icon: 'EyeClosed',
            key: 'blurNsfw',
          },
          {
            icon: 'Eye',
            key: 'hideSeen',
          },
          {
            icon: 'SunDim',
            key: 'dimSeen',
          },
          null,
          t('menu.system'),
          {
            icon: 'Browser',
            key: 'linkBrowser',
          },
          {
            icon: 'TextAa',
            key: 'fontScaling',
          },
        ] as const
      ).map((item) => {
        if (item === null || typeof item === 'string') {
          return item
        }

        return {
          description: 'description' in item ? item.description : undefined,
          icon: {
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
        }
      })}
    />
  )
}
