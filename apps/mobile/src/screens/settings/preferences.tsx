import { SymbolView } from 'expo-symbols'
import { useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu, type MenuItem } from '~/components/common/menu'
import { useList } from '~/hooks/list'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'
import { sides } from '~/types/preferences'

export function SettingsPreferencesScreen() {
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
            icon: 'SortAscending',
            key: 'rememberCommunitySort',
            label: 'browsing.rememberCommunitySort',
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
          {
            icon: 'Drop',
            key: 'blurNavigation',
            label: 'system.blurNavigation',
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
                  tintColor={theme.colors.accent.a9}
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
                [item.key]: value === 'null' ? null : value,
              }

              if (value !== 'null' && value === exclusive) {
                payload[item.exclusive] = value === 'left' ? 'right' : 'left'
              }

              update(payload)
            },
            options: sides.map((option) => {
              const value = option ?? 'null'

              return {
                icon: {
                  name:
                    value === 'left'
                      ? 'arrowLeft'
                      : value === 'right'
                        ? 'arrowRight'
                        : 'eyeClosed',
                  type: 'menu',
                },
                label: t(`side.${value}`),
                right: (
                  <Icon
                    color={theme.colors.accent.a9}
                    name={
                      value === 'left'
                        ? 'ArrowLeft'
                        : value === 'right'
                          ? 'ArrowRight'
                          : 'EyeClosed'
                    }
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
