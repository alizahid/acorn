import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { HeaderButton } from '~/components/navigation/header-button'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useFavorite } from '~/hooks/mutations/communities/favorite'
import { useJoin } from '~/hooks/mutations/communities/join'
import { useCommunity } from '~/hooks/queries/communities/community'
import { usePreferences } from '~/stores/preferences'
import { type CommunityFeedSort } from '~/types/sort'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export function CommunityScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalCommunityPosts, sortCommunityPosts } = usePreferences()

  const { community, refetch } = useCommunity(params.name)

  const join = useJoin()
  const favorite = useFavorite()

  const [sort, setSort] = useState(sortCommunityPosts)
  const [interval, setInterval] = useState(intervalCommunityPosts)

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        community ? (
          <>
            <HeaderButton
              color={community.favorite ? 'amber' : 'gray'}
              icon="Star"
              loading={favorite.isPending}
              onPress={() => {
                favorite.favorite({
                  favorite: !community.favorite,
                  name: community.name,
                })
              }}
              weight={community.favorite ? 'fill' : 'regular'}
            />

            <HeaderButton
              color={community.subscribed ? 'red' : 'accent'}
              icon={community.subscribed ? 'UserCircleMinus' : 'UserCirclePlus'}
              loading={join.isPending}
              onPress={() => {
                join.join({
                  action: community.subscribed ? 'leave' : 'join',
                  id: community.id,
                  name: community.name,
                })
              }}
            />
          </>
        ) : null,
    })
  })

  return (
    <PostList
      community={params.name}
      header={
        <SortIntervalMenu
          interval={interval}
          onChange={(next) => {
            setSort(next.sort as CommunityFeedSort)

            if (next.interval) {
              setInterval(next.interval)
            }
          }}
          sort={sort}
          type="community"
        />
      }
      interval={interval}
      label="user"
      onRefresh={refetch}
      sort={sort}
    />
  )
}
