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
          {
            icon: 'ArrowDown',
            key: 'skipCommentOnLeft',
            label: 'browsing.skipCommentOnLeft',
          },
          null,

          t('compact.title'),
          {
            icon: 'Rows',
            key: 'feedCompact',
            label: 'compact.feedCompact',
          },
          {
            icon: 'ArrowsOut',
            key: 'largeThumbnails',
            label: 'compact.largeThumbnails',
          },
          {
            icon: 'Image',
            key: 'mediaOnRight',
            label: 'compact.mediaOnRight',
          },

          null,
          t('history.title'),
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
            icon: 'SunDim',
            key: 'dimSeen',
            label: 'history.dimSeen',
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

          null,
          t('feedback.title'),
          {
            icon: 'Browser',
            key: 'feedbackHaptics',
            label: 'feedback.feedbackHaptics',
          },
          {
            icon: 'TextAa',
            key: 'feedbackSounds',
            label: 'feedback.feedbackSounds',
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
