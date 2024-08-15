import { default as Constants } from 'expo-constants'
import { useCallback, useMemo } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { CommentSortColors, CommentSortIcons } from '~/components/comments/sort'
import { Icon } from '~/components/common/icon'
import { Text } from '~/components/common/text'
import { TopIntervalItem } from '~/components/posts/interval'
import { FeedSortColors, FeedSortIcons } from '~/components/posts/sort'
import {
  type SettingsItem,
  type SettingsItemOption,
  SettingsMenu,
} from '~/components/settings/menu'
import { getTranslator } from '~/intl'
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

  const { styles, theme } = useStyles(stylesheet)

  const enhanceSort = useCallback(
    (sort: FeedSort | CommentSort): SettingsItemOption => {
      const color = theme.colors[colors[sort]].a9

      return {
        icon: {
          color,
          name: icons[sort],
        },
        label: tSort(sort),
        right: <Icon color={color} name={icons[sort]} size={theme.space[5]} />,
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
        <Text
          highContrast={false}
          size="1"
          style={styles.version}
          variant="mono"
        >
          v{Constants.expoConfig?.version ?? 0}
        </Text>
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

const stylesheet = createStyleSheet((theme) => ({
  sort: {
    height: theme.space[5],
    width: theme.space[5],
  },
  version: {
    margin: theme.space[4],
  },
}))

const icons = {
  ...CommentSortIcons,
  ...FeedSortIcons,
}

const colors = {
  ...CommentSortColors,
  ...FeedSortColors,
}
