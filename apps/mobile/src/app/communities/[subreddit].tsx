import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'

import { FeedTypeMenu, TopIntervalMenu } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import {
  type FeedTypeSubreddit,
  type TopInterval,
} from '~/hooks/queries/posts/posts'

type Params = {
  subreddit: string
}

export default function Screen() {
  const navigation = useNavigation()

  const params = useLocalSearchParams<Params>()

  const [type, setType] = useState<FeedTypeSubreddit>('hot')
  const [interval, setInterval] = useState<TopInterval>()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <FeedTypeMenu
            onChange={(next) => {
              setType(next)

              if (next === 'top') {
                setInterval('hour')
              } else {
                setInterval(undefined)
              }
            }}
            subreddit
            type={type}
          />

          {type === 'top' ? (
            <TopIntervalMenu interval={interval} onChange={setInterval} />
          ) : null}
        </>
      ),
    })
  })

  return (
    <PostList interval={interval} subreddit={params.subreddit} type={type} />
  )
}
