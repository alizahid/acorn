import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'

import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { FeedTypeMenu } from '~/components/posts/type'
import { usePreferences } from '~/stores/preferences'
import { type FeedSort } from '~/types/sort'

export function HomeScreen() {
  const navigation = useNavigation()

  const { feedType, intervalFeedPosts, sortFeedPosts } = usePreferences()

  const [type, setType] = useState(feedType)
  const [feed, setFeed] = useState<string>()
  const [sort, setSort] = useState(sortFeedPosts)
  const [interval, setInterval] = useState(intervalFeedPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          feed={feed}
          onChange={(next) => {
            if (next.type) {
              setType(next.type)
              setFeed(undefined)
            }

            if (next.feed) {
              setFeed(next.feed)
            }
          }}
          type={type}
        />
      ),
      headerRight: () => (
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
      ),
    })
  })

  return (
    <PostList
      community={type === 'home' ? undefined : type}
      feed={feed}
      interval={interval}
      label="subreddit"
      sort={sort}
    />
  )
}
