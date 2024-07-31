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
  name: string
}

export default function Screen() {
  const navigation = useNavigation()

  const params = useLocalSearchParams<Params>()

  const [type, setType] = useState<FeedTypeSubreddit>('hot')
  const [interval, setInterval] = useState<TopInterval>()

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FeedTypeMenu
            hideLabel
            onChange={(next) => {
              setType(next)

              if (next === 'top') {
                setInterval('hour')
              } else {
                setInterval(undefined)
              }
            }}
            placement="bottom-end"
            subreddit
            type={type}
          />

          {type === 'top' ? (
            <TopIntervalMenu
              hideLabel
              interval={interval}
              onChange={setInterval}
              placement="bottom-end"
            />
          ) : null}
        </>
      ),
      title: params.name,
    })
  })

  return (
    <PostList inset interval={interval} subreddit={params.name} type={type} />
  )
}
