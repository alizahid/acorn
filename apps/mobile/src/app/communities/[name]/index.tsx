import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import { z } from 'zod'

import { CommunityAboutCard } from '~/components/communities/about'
import { HeaderButton } from '~/components/navigation/header-button'
import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { useCommunity } from '~/hooks/queries/communities/community'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { communityInterval, communitySort } = usePreferences()

  const { community, refetch } = useCommunity(params.name)

  const [sort, setSort] = useState(communitySort)
  const [interval, setInterval] = useState(communityInterval)

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          color="gray"
          icon="MagnifyingGlass"
          onPress={() => {
            router.navigate({
              params: {
                name: params.name,
              },
              pathname: '/communities/[name]/search',
            })
          }}
          weight="bold"
        />
      ),
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
        community ? <CommunityAboutCard community={community} /> : undefined
      }
      insets={['top', 'bottom', 'header']}
      interval={interval}
      label="user"
      onRefresh={refetch}
      sort={sort}
    />
  )
}
