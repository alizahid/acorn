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
          t('browsing.title'),
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
            icon: 'SortAscending',
            key: 'rememberCommunitySort',
            label: 'browsing.rememberCommunitySort',
          },
          {
            icon: 'HandSwipeLeft',
            key: 'gestures',
            label: 'browsing.gestures',
          },

          null,
          t('history.title'),
          {
            icon: 'SunDim',
            key: 'dimSeen',
            label: 'history.dimSeen',
          },
          {
            icon: 'ArrowFatUp',
            key: 'seenOnVote',
            label: 'history.seenOnVote',
          },
          {
            icon: 'Image',
            key: 'seenOnMedia',
            label: 'history.seenOnMedia',
          },
          {
            description: 'history.seenOnScroll.description',
            icon: 'MouseScroll',
            key: 'seenOnScroll',
            label: 'history.seenOnScroll.label',
          },
          {
            description: 'history.hideSeen.description',
            icon: 'Eye',
            key: 'hideSeen',
            label: 'history.hideSeen.label',
          },

          null,
          t('media.title'),
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

          null,
          t('system.title'),
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
        if (!item || typeof item === 'string') {
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
