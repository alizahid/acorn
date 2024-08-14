import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { CommunityJoinCard } from '~/components/communities/join'
import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { useCommunity } from '~/hooks/queries/communities/community'
import { type CommunityFeedSort, type TopInterval } from '~/types/sort'

const schema = z.object({
  name: z.string().catch('acornapp'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { community, refetch } = useCommunity(params.name)

  const [sort, setSort] = useState<CommunityFeedSort>('hot')
  const [interval, setInterval] = useState<TopInterval>()

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FeedSortMenu
            hideLabel
            onChange={(next) => {
              setSort(next)

              if (next === 'top') {
                setInterval('hour')
              } else {
                setInterval(undefined)
              }
            }}
            type="community"
            value={sort}
          />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={setInterval}
              value={interval}
            />
          ) : null}
        </>
      ),
      title: params.name,
    })
  })

  return (
    <PostList
      community={params.name}
      header={
        community ? <CommunityJoinCard community={community} /> : undefined
      }
      insets={['top', 'bottom', 'header']}
      interval={interval}
      label="user"
      onRefresh={refetch}
      sort={sort}
    />
  )
}
