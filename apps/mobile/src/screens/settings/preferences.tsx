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
          t('browsing.label'),
          {
            icon: 'Rows',
            key: 'feedCompact',
            label: 'browsing.feedCompact',
          },
          {
            description: 'browsing.mediaOnRight.description',
            icon: 'Image',
            key: 'mediaOnRight',
            label: 'browsing.mediaOnRight.label',
          },
          {
            icon: 'Medal',
            key: 'showFlair',
            label: 'browsing.showFlair',
          },
          {
            icon: 'ArrowFatUp',
            key: 'seenOnVote',
            label: 'browsing.seenOnVote',
          },
          {
            icon: 'Image',
            key: 'seenOnMedia',
            label: 'browsing.seenOnMedia',
          },
          {
            description: 'browsing.seenOnScroll.description',
            icon: 'MouseScroll',
            key: 'seenOnScroll',
            label: 'browsing.seenOnScroll.label',
          },
          {
            description: 'browsing.hideSeen.description',
            icon: 'Eye',
            key: 'hideSeen',
            label: 'browsing.hideSeen.label',
          },
          {
            icon: 'SunDim',
            key: 'dimSeen',
            label: 'browsing.dimSeen',
          },
          {
            icon: 'SortAscending',
            key: 'rememberCommunitySort',
            label: 'browsing.rememberCommunitySort',
          },
          t('media.label'),
          {
            icon: 'SpeakerSimpleX',
            key: 'feedMuted',
            label: 'media.feedMuted',
          },
          {
            icon: 'SpeakerSimpleHigh',
            key: 'unmuteFullscreen',
            label: 'media.unmuteFullscreen',
          },
          {
            icon: 'EyeClosed',
            key: 'blurNsfw',
            label: 'media.blurNsfw',
          },
          t('system.label'),
          {
            icon: 'Browser',
            key: 'linkBrowser',
            label: 'system.linkBrowser',
          },
          {
            icon: 'TextAa',
            key: 'fontScaling',
            label: 'system.fontScaling',
          },
        ] as const
      ).map((item) => {
        if (typeof item === 'string') {
          return item
        }

        return {
          description: 'description' in item ? t(item.description) : undefined,
          icon: {
            name: item.icon,
          },
          label: t(item.label),
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
