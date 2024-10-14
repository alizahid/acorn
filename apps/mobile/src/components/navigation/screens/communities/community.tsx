import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { z } from 'zod'

import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { useJoin } from '~/hooks/mutations/communities/join'
import { useCommunity } from '~/hooks/queries/communities/community'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('acornblue'),
})

export type CommunityParams = z.infer<typeof schema>

export function CommunityScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalCommunityPosts, sortCommunityPosts, update } =
    usePreferences()

  const { community, refetch } = useCommunity(params.name)
  const { isPending, join } = useJoin()

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
        />
      ),
      headerRight: () =>
        community ? (
          <HeaderButton
            color={community.subscribed ? 'red' : 'accent'}
            icon={community.subscribed ? 'UserCircleMinus' : 'UserCirclePlus'}
            loading={isPending}
            onPress={() => {
              join({
                action: community.subscribed ? 'leave' : 'join',
                id: community.id,
                name: community.name,
              })
            }}
          />
        ) : null,
    })
  })

  return (
    <PostList
      community={params.name}
      header={
        <View direction="row" justify="end">
          <FeedSortMenu
            onChange={(next) => {
              update({
                sortCommunityPosts: next,
              })
            }}
            type="community"
            value={sortCommunityPosts}
          />

          {sortCommunityPosts === 'top' ? (
            <TopIntervalMenu
              onChange={(next) => {
                update({
                  intervalCommunityPosts: next,
                })
              }}
              value={intervalCommunityPosts}
            />
          ) : null}
        </View>
      }
      interval={intervalCommunityPosts}
      label="user"
      onRefresh={refetch}
      sort={sortCommunityPosts}
    />
  )
}
