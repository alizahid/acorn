import { SymbolView } from 'expo-symbols'
import { useCallback } from 'react'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import {
  Menu,
  type MenuItem,
  type MenuItemOption,
} from '~/components/common/menu'
// import { icons } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { IntervalIcons, SortColors, SortIcons } from '~/lib/sort'
import { usePreferences } from '~/stores/preferences'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  SearchSort,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

export default function Screen() {
  const t = useTranslations('screen.settings.sort')
  const tCommon = useTranslations('component.common')

  const { update, ...preferences } = usePreferences()

  const { theme } = useStyles()

  const listProps = useList()

  const enhanceSort = useCallback(
    (sort: FeedSort | CommentSort | SearchSort): MenuItemOption => {
      const icon = SortIcons[sort]
      const color = theme.colors[SortColors[sort]][9]

      return {
        icon: {
          color,
          name: SortIcons[sort],
          type: 'icon',
        },
        label: tCommon(`sort.${sort}`),
        right: (
          <Icon
            color={color}
            name={icon}
            size={theme.space[5]}
            weight="duotone"
          />
        ),
        value: sort,
      } satisfies MenuItemOption
    },
    [tCommon, theme.colors, theme.space],
  )

  const enhanceInterval = useCallback(
    (interval: TopInterval): MenuItemOption => ({
      icon: {
        color: theme.colors.gold[9],
        name: IntervalIcons[interval],
        type: 'symbol',
      },
      label: tCommon(`interval.${interval}`),
      right: (
        <SymbolView
          name={IntervalIcons[interval]}
          size={theme.space[5]}
          tintColor={theme.colors.gold.a9}
        />
      ),
      value: interval,
    }),
    [tCommon, theme.colors.gold, theme.space],
  )

  return (
    <Menu
      items={(
        [
          t('feed.title'),
          [
            'sortFeedPosts',
            'feed.sort',
            FeedSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalFeedPosts',
            'feed.interval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          t('search.title'),
          [
            'sortSearchPosts',
            'search.sort',
            SearchSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalSearchPosts',
            'search.interval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          null,
          t('community.title'),
          [
            'sortCommunityPosts',
            'community.sort',
            CommunityFeedSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalCommunityPosts',
            'community.interval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],

          null,
          t('post.title'),
          [
            'sortPostComments',
            'post.sort',
            CommentSort.map((item) => enhanceSort(item)),
          ],

          null,
          t('user.title'),
          [
            'sortUserPosts',
            'user.posts.sort',
            UserFeedSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalUserPosts',
            'user.posts.interval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],
          [
            'sortUserComments',
            'user.comments.sort',
            CommentSort.map((item) => enhanceSort(item)),
          ],
          [
            'intervalUserComments',
            'user.comments.interval',
            TopInterval.map((item) => enhanceInterval(item)),
          ],
        ] as const
      ).map((item) => {
        if (typeof item === 'string' || !item) {
          return item
        }

        const [key, label, options] = item

        return {
          icon: {
            name: key.startsWith('sort') ? 'SortAscending' : 'Clock',
            type: 'icon',
          },
          label: t(label),
          onSelect: (next) => {
            update({
              [key]: next,
            })
          },
          options,
          type: 'options',
          value: preferences[key],
        } satisfies MenuItem
      })}
      listProps={listProps}
    />
  )
}
