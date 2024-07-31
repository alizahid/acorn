import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { useTranslations } from 'use-intl'

import { FeedTypeMenu, TopIntervalMenu } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import {
  type FeedTypeSubreddit,
  type TopInterval,
  type UserFeedType,
} from '~/hooks/queries/posts/posts'

type Params = {
  name: string
  type: UserFeedType
}

export default function Screen() {
  const navigation = useNavigation()
  const params = useLocalSearchParams<Params>()

  const t = useTranslations('screen.user.index.menu')

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
            type={type}
            user
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
      title: t(params.type!),
    })
  })

  return (
    <PostList
      inset
      interval={interval}
      type={type}
      userName={params.name}
      userType={params.type}
    />
  )
}
