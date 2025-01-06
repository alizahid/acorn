import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { FeedTypeMenu } from '~/components/home/type-menu'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { iPad } from '~/lib/common'
import { FeedType } from '~/types/sort'

const schema = z.object({
  feed: z.string().optional(),
  type: z.enum(FeedType).catch('home'),
})

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const { theme } = useStyles()

  const listProps = useList({
    padding: iPad ? theme.space[4] : undefined,
  })

  const { sorting, update: updateSorting } = useSorting(
    'feed',
    params.feed ?? params.type,
  )

  useFocusEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FeedTypeMenu
          data={params}
          disabled={iPad}
          onPress={() => {
            // @ts-expect-error -- go away
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- go away
            navigation.toggleDrawer()
          }}
        />
      ),
      headerRight: () => (
        <SortIntervalMenu
          interval={sorting.interval}
          onChange={(next) => {
            updateSorting(next)
          }}
          sort={sorting.sort}
          type={params.feed ? 'feed' : 'community'}
        />
      ),
    })
  })

  return (
    <PostList
      community={params.type === 'home' ? undefined : params.type}
      feed={params.feed}
      interval={sorting.interval}
      label="subreddit"
      listProps={listProps}
      sort={sorting.sort}
    />
  )
}
