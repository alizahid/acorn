import { ScrollView } from 'react-native-gesture-handler'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Menu } from '~/components/common/menu'
import { IntervalItem } from '~/components/settings/interval'
import { SortItem } from '~/components/settings/sort'
import { useListProps } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.sort')

  const {
    intervalCommunityPosts,
    intervalFeedPosts,
    intervalSearchPosts,
    intervalUserComments,
    intervalUserPosts,
    rememberSorting,
    sortCommunityPosts,
    sortFeedPosts,
    sortPostComments,
    sortSearchPosts,
    sortUserComments,
    sortUserPosts,
    update,
  } = usePreferences(
    useShallow((state) => ({
      intervalCommunityPosts: state.intervalCommunityPosts,
      intervalFeedPosts: state.intervalFeedPosts,
      intervalSearchPosts: state.intervalSearchPosts,
      intervalUserComments: state.intervalUserComments,
      intervalUserPosts: state.intervalUserPosts,
      rememberSorting: state.rememberSorting,
      sortCommunityPosts: state.sortCommunityPosts,
      sortFeedPosts: state.sortFeedPosts,
      sortPostComments: state.sortPostComments,
      sortSearchPosts: state.sortSearchPosts,
      sortUserComments: state.sortUserComments,
      sortUserPosts: state.sortUserPosts,
      update: state.update,
    })),
  )

  const listProps = useListProps({
    extraBottom: space[4],
    extraTop: space[4],
    flash: false,
  })

  return (
    <ScrollView {...listProps}>
      <Menu.Root>
        <Menu.Switch
          label={t('remember')}
          onChange={(next) => {
            update({
              rememberSorting: next,
            })
          }}
          value={rememberSorting}
        />

        <Menu.Separator />

        <Menu.Label>{t('feed.title')}</Menu.Label>

        <SortItem
          label={t('feed.sort')}
          onChange={(next) => {
            update({
              sortFeedPosts: next,
            })
          }}
          type="feed"
          value={sortFeedPosts}
        />

        <IntervalItem
          label={t('feed.interval')}
          onChange={(next) => {
            update({
              intervalFeedPosts: next,
            })
          }}
          value={intervalFeedPosts}
        />

        <Menu.Separator />

        <Menu.Label>{t('search.title')}</Menu.Label>

        <SortItem
          label={t('search.sort')}
          onChange={(next) => {
            update({
              sortSearchPosts: next,
            })
          }}
          type="search"
          value={sortSearchPosts}
        />

        <IntervalItem
          label={t('search.interval')}
          onChange={(next) => {
            update({
              intervalSearchPosts: next,
            })
          }}
          value={intervalSearchPosts}
        />

        <Menu.Separator />

        <Menu.Label>{t('community.title')}</Menu.Label>

        <SortItem
          label={t('community.sort')}
          onChange={(next) => {
            update({
              sortCommunityPosts: next,
            })
          }}
          type="community"
          value={sortCommunityPosts}
        />

        <IntervalItem
          label={t('community.interval')}
          onChange={(next) => {
            update({
              intervalCommunityPosts: next,
            })
          }}
          value={intervalCommunityPosts}
        />

        <Menu.Separator />

        <Menu.Label>{t('post.title')}</Menu.Label>

        <SortItem
          label={t('post.sort')}
          onChange={(next) => {
            update({
              sortPostComments: next,
            })
          }}
          type="comment"
          value={sortPostComments}
        />

        <Menu.Separator />

        <Menu.Label>{t('user.title')}</Menu.Label>

        <SortItem
          label={t('user.posts.sort')}
          onChange={(next) => {
            update({
              sortUserPosts: next,
            })
          }}
          type="user"
          value={sortUserPosts}
        />

        <IntervalItem
          label={t('user.posts.interval')}
          onChange={(next) => {
            update({
              intervalUserPosts: next,
            })
          }}
          value={intervalUserPosts}
        />

        <SortItem
          label={t('user.comments.sort')}
          onChange={(next) => {
            update({
              sortUserComments: next,
            })
          }}
          type="user"
          value={sortUserComments}
        />

        <IntervalItem
          label={t('user.comments.interval')}
          onChange={(next) => {
            update({
              intervalUserComments: next,
            })
          }}
          value={intervalUserComments}
        />
      </Menu.Root>
    </ScrollView>
  )
}
