import * as Application from 'expo-application'
import { useCallback, useMemo } from 'react'
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
import { SortColors, SortIcons } from '~/lib/sort'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

export default function Screen() {
  const t = useTranslations('tab.settings')
  const tSort = getTranslator('component.common.sort')
  const tInterval = getTranslator('component.common.interval')

  const { clearCache } = useAuth()
  const { blurNsfw, feedMuted, linkBrowser, update, ...preferences } =
    usePreferences()

  const handleLink = useLink()

  const { theme } = useStyles()

  const enhanceSort = useCallback(
    (sort: FeedSort | CommentSort): SettingsItemOption => {
      const icon = SortIcons[sort]
      const color = theme.colors[SortColors[sort]].a9

      return {
        icon: {
          color,
          name: icon,
        },
        label: tSort(sort),
        right: <Icon color={color} name={icon} size={theme.space[5]} />,
        value: sort,
      }
    },
    [tSort, theme.colors, theme.space],
  )

  const enhanceInterval = useCallback(
    (interval: TopInterval): SettingsItemOption => ({
      label: tInterval(interval),
      left: (
        <TopIntervalItem
          item={interval}
          size={theme.typography[2].lineHeight}
        />
      ),
      right: <TopIntervalItem item={interval} size={theme.space[5]} />,
      value: interval,
    }),
    [tInterval, theme.space, theme.typography],
  )

  const sort = useMemo<Array<SettingsItem>>(
    () =>
      (
        [
          ['feedSort', FeedSort.map((item) => enhanceSort(item))],
          ['feedInterval', TopInterval.map((item) => enhanceInterval(item))],

          ['communitySort', CommunityFeedSort.map((item) => enhanceSort(item))],
          [
            'communityInterval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          ['postCommentSort', CommentSort.map((item) => enhanceSort(item))],

          ['userSort', UserFeedSort.map((item) => enhanceSort(item))],
          ['userInterval', TopInterval.map((item) => enhanceInterval(item))],
          ['userCommentSort', CommentSort.map((item) => enhanceSort(item))],
        ] as const
      ).map(([key, options]) => ({
        label: t(`menu.sort.${key}`),
        onSelect: (next) => {
          update({
            [key]: next,
          })
        },
        options,
        type: 'options',
        value: preferences[key],
      })),
    [enhanceInterval, enhanceSort, preferences, t, update],
  )

  return (
    <SettingsMenu
      footer={
        <View align="center" gap="4" p="4">
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
      insets={['top', 'bottom', 'header', 'tabBar']}
      items={[
        t('menu.general.title'),
        {
          icon: {
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
            name: 'Drop',
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
        t('menu.sort.title'),
        ...sort,
        t('menu.cache.title'),
        {
          icon: {
            name: 'HardDrives',
          },
          label: t('menu.cache.query'),
          onPress() {
            clearCache()
          },
        },
      ]}
    />
  )
}
