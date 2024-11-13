import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'

import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { FeedTypeMenu } from '~/components/posts/type'
import { type FeedTypeSheetProps } from '~/sheets/feed-type'
import { usePreferences } from '~/stores/preferences'
import { type FeedSort } from '~/types/sort'

export function HomeScreen() {
  const navigation = useNavigation()

  const { feedType, intervalFeedPosts, sortFeedPosts } = usePreferences()

  const [data, setData] = useState<FeedTypeSheetProps>({
    type: feedType,
  })
  const [sort, setSort] = useState(sortFeedPosts)
  const [interval, setInterval] = useState(intervalFeedPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          community={data.community}
          feed={data.feed}
          onChange={(next) => {
            setData(next)
          }}
          type={data.type}
          user={data.user}
        />
      ),
      headerRight: () =>
        !data.user ? (
          <SortIntervalMenu
            interval={interval}
            onChange={(next) => {
              setSort(next.sort as FeedSort)

              if (next.interval) {
                setInterval(next.interval)
              }
            }}
            sort={sort}
            type="feed"
          />
        ) : null,
    })
  })

  return (
    <PostList
      community={
        data.community
          ? data.community
          : data.type === 'home'
            ? undefined
            : data.type
      }
      feed={data.feed}
      interval={interval}
      label="subreddit"
      sort={sort}
      user={data.user}
    />
  )
}
