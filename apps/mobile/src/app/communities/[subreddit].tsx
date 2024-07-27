import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'

import { PostHeader } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import { type FeedTypeSubreddit } from '~/hooks/queries/posts/posts'

type Params = {
  subreddit: string
}

export default function Screen() {
  const navigation = useNavigation()

  const params = useLocalSearchParams<Params>()

  const [type, setType] = useState<FeedTypeSubreddit>('hot')

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PostHeader
          hideLabel
          onChange={(next) => {
            setType(next)
          }}
          type={type}
        />
      ),
      title: params.subreddit,
    })
  })

  return <PostList subreddit={params.subreddit} type={type} />
}
