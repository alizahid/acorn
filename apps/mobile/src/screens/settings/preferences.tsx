import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon, type IconName } from '~/components/common/icon'
import { Menu, type MenuItem } from '~/components/common/menu'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { sides } from '~/types/preferences'

export function SettingsPreferencesScreen() {
  const t = useTranslations('screen.settings.preferences')

  const { update, ...preferences } = usePreferences()

  const { theme } = useStyles()

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

          null,
          t('comments.title'),
          {
            exclusive: 'replyPost',
            icon: 'ArrowDown',
            key: 'skipComment',
            label: 'comments.skipComment',
          },
          {
            exclusive: 'skipComment',
            icon: 'ArrowBendUpLeft',
            key: 'replyPost',
            label: 'comments.replyPost',
          },
          {
            icon: 'PaintBrush',
            key: 'coloredComments',
            label: 'comments.coloredComments',
          },
          {
            icon: 'PushPin',
            key: 'collapseAutoModerator',
            label: 'comments.collapseAutoModerator',
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
          {
            icon: 'TextT',
            key: 'fontSystem',
            label: 'system.fontSystem',
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

        if ('exclusive' in item) {
          return {
            icon: {
              name: item.icon,
            },
            label: t(item.label),
            onSelect(value) {
              const exclusive = preferences[item.exclusive]

              const payload: Partial<PreferencesPayload> = {
                [item.key]: value === 'null' ? null : value,
              }

              if (value !== 'null' && value === exclusive) {
                payload[item.exclusive] = value === 'left' ? 'right' : 'left'
              }

              update(payload)
            },
            options: sides.map((option) => {
              const value = option ?? 'null'

              const icon: IconName =
                value === 'left'
                  ? 'ArrowLeft'
                  : value === 'right'
                    ? 'ArrowRight'
                    : 'EyeClosed'

              return {
                icon: {
                  name: icon,
                },
                label: t(`side.${value}`),
                right: (
                  <Icon
                    color={theme.colors.accent.a9}
                    name={icon}
                    weight="duotone"
                  />
                ),
                value,
              }
            }),
            type: 'options',
            value: preferences[item.key] ?? 'null',
          } satisfies MenuItem
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
        } satisfies MenuItem
      })}
    />
  )
}
