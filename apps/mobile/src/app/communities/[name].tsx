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
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('acornapp'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { communityInterval, communitySort } = usePreferences()

  const { community, refetch } = useCommunity(params.name)

  const [sort, setSort] = useState(communitySort)
  const [interval, setInterval] = useState(communityInterval)

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FeedSortMenu
            hideLabel
            onChange={setSort}
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
