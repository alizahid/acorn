import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'

import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { FeedTypeMenu } from '~/components/posts/type'
import { usePreferences } from '~/stores/preferences'

export function HomeScreen() {
  const navigation = useNavigation()

  const { feedType, intervalFeedPosts, sortFeedPosts } = usePreferences()

  const [type, setType] = useState(feedType)
  const [sort, setSort] = useState(sortFeedPosts)
  const [interval, setInterval] = useState(intervalFeedPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu hideLabel onChange={setType} value={type} />
      ),
      headerRight: () => (
        <>
          <FeedSortMenu hideLabel onChange={setSort} value={sort} />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={setInterval}
              value={interval}
            />
          ) : null}
        </>
      ),
    })
  })

  return (
    <PostList
      community={type === 'home' ? undefined : type}
      interval={interval}
      label="subreddit"
      sort={sort}
    />
  )
}
