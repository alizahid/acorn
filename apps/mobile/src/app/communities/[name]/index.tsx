import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
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

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const preferences = usePreferences()

  const { community, refetch } = useCommunity(params.name)
  const { isPending, join } = useJoin()

  const { styles } = useStyles(stylesheet)

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
      title: params.name,
    })
  })

  const [sort, setSort] = useState(preferences.communitySort)
  const [interval, setInterval] = useState(preferences.communityInterval)

  return (
    <PostList
      community={params.name}
      header={
        <View direction="row" justify="between" style={styles.header}>
          <FeedSortMenu onChange={setSort} type="community" value={sort} />

          {sort === 'top' ? (
            <TopIntervalMenu onChange={setInterval} value={interval} />
          ) : null}
        </View>
      }
      inset
      interval={interval}
      label="user"
      onRefresh={refetch}
      sort={sort}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.a2,
  },
}))
