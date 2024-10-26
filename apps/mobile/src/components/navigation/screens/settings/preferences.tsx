import { useFormatter, useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { SettingsMenu } from '~/components/settings/menu'
import { usePreferences } from '~/stores/preferences'

export function SettingsPreferencesScreen() {
  const t = useTranslations('screen.settings.preferences')
  const f = useFormatter()

  const { update, ...preferences } = usePreferences()

  return (
    <SettingsMenu
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
          'seenInterval',
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
        if (item === 'seenInterval') {
          return {
            icon: {
              name: 'Clock',
            },
            label: t('menu.seenInterval'),
            onSelect(value) {
              update({
                seenInterval: Number(value),
              })
            },
            options: [1_000, 3_000, 5_000, 10_000].map((duration) => {
              const label = f.number(duration / 1_000, {
                style: 'unit',
                unit: 'second',
              })

              return {
                label,
                right: (
                  <Text highContrast weight="bold">
                    {label}
                  </Text>
                ),
                value: String(duration),
              }
            }),
            type: 'options',
            value: String(preferences.seenInterval),
          }
        }

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
