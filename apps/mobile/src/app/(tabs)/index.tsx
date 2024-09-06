import { useFocusEffect, useNavigation } from 'expo-router'

import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { intervalFeedPosts, sortFeedPosts, update } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <FeedSortMenu
            onChange={(next) => {
              update({
                sortFeedPosts: next,
              })
            }}
            value={sortFeedPosts}
          />

          {sortFeedPosts === 'top' ? (
            <TopIntervalMenu
              onChange={(next) => {
                update({
                  intervalFeedPosts: next,
                })
              }}
              value={intervalFeedPosts}
            />
          ) : null}
        </>
      ),
    })
  })

  return (
    <PostList
      interval={intervalFeedPosts}
      label="subreddit"
      sort={sortFeedPosts}
    />
  )
}
