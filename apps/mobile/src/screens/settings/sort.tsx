import { useCallback } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Menu, type MenuItemOption } from '~/components/common/menu'
import { TopIntervalItem } from '~/components/posts/interval'
import { getTranslator } from '~/intl'
import { SortColors, SortIcons } from '~/lib/sort'
import { usePreferences } from '~/stores/preferences'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

export function SettingsSortScreen() {
  const t = useTranslations('screen.settings.sort')
  const tSort = getTranslator('component.common.sort')
  const tInterval = getTranslator('component.common.interval')

  const { update, ...preferences } = usePreferences()

  const { theme } = useStyles()

  const enhanceSort = useCallback(
    (sort: FeedSort | CommentSort): MenuItemOption => {
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
    },
    [tSort, theme.colors, theme.space],
  )

  const enhanceInterval = useCallback(
    (interval: TopInterval): MenuItemOption => {
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
    },
    [tInterval, theme.space, theme.typography],
  )

  return (
    <Menu
      items={(
        [
          t('menu.feed'),
          ['sortFeedPosts', FeedSort.map((item) => enhanceSort(item))],
          [
            'intervalFeedPosts',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          null,
          t('menu.community'),
          [
            'sortCommunityPosts',
            CommunityFeedSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalCommunityPosts',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          null,
          t('menu.post'),
          ['sortPostComments', CommentSort.map((item) => enhanceSort(item))],

          null,
          t('menu.user'),
          ['sortUserPosts', UserFeedSort.map((item) => enhanceSort(item))],
          [
            'intervalUserPosts',
            TopInterval.map((item) => enhanceInterval(item)),
          ],
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
          label: t(`menu.${key}`),
          onSelect: (next) => {
            update({
              [key]: next,
            })
          },
          options,
          type: 'options',
          value: preferences[key],
        }
      })}
    />
  )
}
