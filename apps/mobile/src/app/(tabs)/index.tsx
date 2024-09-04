import { useFocusEffect, useNavigation } from 'expo-router'
import { useState } from 'react'

import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { feedInterval, feedSort } = usePreferences()

  const [sort, setSort] = useState(feedSort)
  const [interval, setInterval] = useState(feedInterval)

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <FeedSortMenu onChange={setSort} value={sort} />

          {sort === 'top' ? (
            <TopIntervalMenu onChange={setInterval} value={interval} />
          ) : null}
        </>
      ),
    })
  })

  return <PostList interval={interval} label="subreddit" sort={sort} />
}
