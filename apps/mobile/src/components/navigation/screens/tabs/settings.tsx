import * as Application from 'expo-application'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Logo } from '~/components/common/logo'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { TopIntervalItem } from '~/components/posts/interval'
import {
  type SettingsItem,
  type SettingsItemOption,
  SettingsMenu,
} from '~/components/settings/menu'
import { useLink } from '~/hooks/link'
import { getTranslator } from '~/intl'
import { queryClient } from '~/lib/query'
import { SortColors, SortIcons } from '~/lib/sort'
import { usePreferences } from '~/stores/preferences'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

export function SettingsScreen() {
  const t = useTranslations('screen.settings')
  const tSort = getTranslator('component.common.sort')
  const tInterval = getTranslator('component.common.interval')

  const { blurNsfw, feedMuted, linkBrowser, update, ...preferences } =
    usePreferences()

  const { handleLink } = useLink()

  const { theme } = useStyles()

  function enhanceSort(sort: FeedSort | CommentSort): SettingsItemOption {
    const icon = SortIcons[sort]
    const color = theme.colors[SortColors[sort]].a9

    return {
      icon: {
        color,
        name: icon,
        weight: 'duotone',
      },
      label: tSort(sort),
      right: (
        <Icon
          color={color}
          name={icon}
          size={theme.space[5]}
          weight="duotone"
        />
      ),
      value: sort,
    }
  }

  function enhanceInterval(interval: TopInterval): SettingsItemOption {
    return {
      label: tInterval(interval),
      left: (
        <TopIntervalItem
          item={interval}
          size={theme.typography[2].lineHeight}
        />
      ),
      right: <TopIntervalItem item={interval} size={theme.space[5]} />,
      value: interval,
    }
  }

  const sort: Array<SettingsItem | string | null> = (
    [
      null,
      t('menu.sort.feed'),
      ['sortFeedPosts', FeedSort.map((item) => enhanceSort(item))],
      ['intervalFeedPosts', TopInterval.map((item) => enhanceInterval(item))],

      null,
      t('menu.sort.community'),
      [
        'sortCommunityPosts',
        CommunityFeedSort.map((item) => enhanceSort(item)),
      ],
      [
        'intervalCommunityPosts',
        TopInterval.map((item) => enhanceInterval(item)),
      ],

      null,
      t('menu.sort.post'),
      ['sortPostComments', CommentSort.map((item) => enhanceSort(item))],

      null,
      t('menu.sort.user'),
      ['sortUserPosts', UserFeedSort.map((item) => enhanceSort(item))],
      ['intervalUserPosts', TopInterval.map((item) => enhanceInterval(item))],
      ['sortUserComments', CommentSort.map((item) => enhanceSort(item))],
      [
        'intervalUserComments',
        TopInterval.map((item) => enhanceInterval(item)),
      ],
    ] as const
  ).map((item) => {
    if (typeof item === 'string' || !item) {
      return item
    }

    const [key, options] = item

    return {
      icon: {
        name: key.startsWith('sort') ? 'SortAscending' : 'Clock',
      },
      label: t(`menu.sort.${key}`),
      onSelect: (next) => {
        update({
          [key]: next,
        })
      },
      options,
      type: 'options',
      value: preferences[key],
    } satisfies SettingsItem
  })

  return (
    <SettingsMenu
      footer={
        <View align="center" gap="4" mt="4" p="4">
          <Logo size={theme.space[8]} />

          <View direction="row" gap="4" justify="center">
            <Text highContrast={false} size="2" variant="mono">
              {t('footer.version', {
                version: Application.nativeApplicationVersion,
              })}
            </Text>

            <Pressable
              onPress={() => {
                void handleLink('https://acorn.blue')
              }}
            >
              <Text color="accent" size="2">
                {t('footer.web')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                void handleLink('https://reddit.com/r/acornblue')
              }}
            >
              <Text color="accent" size="2">
                {t('footer.reddit')}
              </Text>
            </Pressable>
          </View>
        </View>
      }
      items={[
        t('menu.general.title'),
        {
          icon: {
            color: theme.colors.plum.a9,
            name: 'SpeakerSimpleX',
          },
          label: t('menu.general.muted'),
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
          label: t('menu.general.nsfw'),
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
          label: t('menu.general.browser'),
          onSelect(value) {
            update({
              linkBrowser: value,
            })
          },
          type: 'switch',
          value: linkBrowser,
        },

        ...sort,

        null,
        t('menu.cache.title'),
        {
          icon: {
            color: theme.colors.red.a9,
            name: 'HardDrives',
          },
          label: t('menu.cache.query'),
          onPress() {
            queryClient.clear()
          },
        },
      ]}
    />
  )
}
