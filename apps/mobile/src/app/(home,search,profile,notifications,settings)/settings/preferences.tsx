import { SymbolView } from 'expo-symbols'
import { useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu, type MenuItem } from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { sides } from '~/types/preferences'

export default function Screen() {
  const t = useTranslations('screen.settings.preferences')
  const f = useFormatter()

  const { update, ...preferences } = usePreferences()

  const { theme } = useStyles()

  const listProps = useList()

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
            icon: 'Clock',
            key: 'refreshInterval',
            label: 'browsing.refreshInterval',
            options: [
              {
                icon: {
                  name: 'infinity.circle.fill',
                  type: 'symbol',
                },
                label: t('refreshInterval.Infinity'),
                value: Infinity,
              },
              {
                icon: {
                  name: '5.circle.fill',
                  type: 'symbol',
                },
                label: f.number(5, {
                  style: 'unit',
                  unit: 'minute',
                }),
                value: 5,
              },
              {
                icon: {
                  name: '10.circle.fill',
                  type: 'symbol',
                },
                label: f.number(10, {
                  style: 'unit',
                  unit: 'minute',
                }),
                value: 10,
              },
              {
                icon: {
                  name: '15.circle.fill',
                  type: 'symbol',
                },
                label: f.number(15, {
                  style: 'unit',
                  unit: 'minute',
                }),
                value: 15,
              },
              {
                icon: {
                  name: '30.circle.fill',
                  type: 'symbol',
                },
                label: f.number(30, {
                  style: 'unit',
                  unit: 'minute',
                }),
                value: 30,
              },
            ],
          },
          {
            icon: 'Alien',
            key: 'oldReddit',
            label: 'browsing.oldReddit',
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
            icon: 'Play',
            key: 'autoPlay',
            label: 'media.autoPlay',
          },
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
          {
            icon: 'Drop',
            key: 'blurNavigation',
            label: 'system.blurNavigation',
          },

          null,
          t('feedback.title'),
          {
            icon: 'Vibrate',
            key: 'feedbackHaptics',
            label: 'feedback.feedbackHaptics',
          },
          {
            icon: 'MegaphoneSimple',
            key: 'hapticsLoud',
            label: 'feedback.hapticsLoud',
          },
          {
            icon: 'SpeakerSimpleHigh',
            key: 'feedbackSounds',
            label: 'feedback.feedbackSounds',
          },
        ] as const
      ).map((item) => {
        if (!item || typeof item === 'string') {
          return item
        }

        if ('options' in item) {
          return {
            icon: {
              name: item.icon,
              type: 'icon',
            },
            label: t(item.label),
            onSelect(value) {
              update({
                [item.key]: Number(value),
              })
            },
            options: item.options.map((option) => ({
              icon: option.icon,
              label: option.label,
              right: (
                <SymbolView
                  name={option.icon.name}
                  tintColor={theme.colors.accent.accent}
                />
              ),
              value: String(option.value),
            })),
            type: 'options',
            value: String(preferences[item.key]),
          }
        }

        if ('exclusive' in item) {
          return {
            icon: {
              name: item.icon,
              type: 'icon',
            },
            label: t(item.label),
            onSelect(value) {
              const exclusive = preferences[item.exclusive]

              const payload: Partial<PreferencesPayload> = {
                [item.key]: value === 'hide' ? null : value,
              }

              if (value !== 'hide' && value === exclusive) {
                payload[item.exclusive] = value === 'left' ? 'right' : 'left'
              }

              update(payload)
            },
            options: sides.map((option) => {
              const value = option ?? 'hide'

              const icon =
                value === 'left'
                  ? 'ArrowLeft'
                  : value === 'right'
                    ? 'ArrowRight'
                    : 'EyeClosed'

              return {
                icon: {
                  name: icon,
                  type: 'icon',
                },
                label: t(`side.${value}`),
                right: (
                  <Icon
                    color={theme.colors.accent.accent}
                    name={icon}
                    weight="bold"
                  />
                ),
                value,
              }
            }),
            type: 'options',
            value: preferences[item.key] ?? 'hide',
          } satisfies MenuItem
        }

        return {
          description: 'description' in item ? t(item.description) : undefined,
          icon: {
            name: item.icon,
            type: 'icon',
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
      listProps={listProps}
    />
  )
}
