import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useRef, useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentList } from '~/components/comments/list'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { PostList } from '~/components/posts/list'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { usePreferences } from '~/stores/preferences'
import { UserTab } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export type UserParams = z.infer<typeof schema>

export function UserScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const {
    intervalUserComments,
    intervalUserPosts,
    sortUserComments,
    sortUserPosts,
  } = usePreferences()

  const t = useTranslations('screen.users.user')

  const { profile, refetch } = useProfile(params.name)
  const { follow, isPending } = useFollow()

  const { styles } = useStyles(stylesheet)

  const routes = useRef(
    UserTab.map((key) => ({
      key,
      title: t(`tabs.${key}`),
    })),
  )

  const [index, setIndex] = useState(0)

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        profile ? (
          <HeaderButton
            color={profile.subscribed ? 'red' : 'accent'}
            icon={profile.subscribed ? 'UserCircleMinus' : 'UserCirclePlus'}
            loading={isPending}
            onPress={() => {
              follow({
                action: profile.subscribed ? 'unfollow' : 'follow',
                id: profile.subreddit,
                name: profile.name,
              })
            }}
          />
        ) : undefined,
    })
  })

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes: routes.current,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'posts') {
          return (
            <PostList
              interval={intervalUserPosts}
              label="subreddit"
              onRefresh={refetch}
              sort={sortUserPosts}
              user={params.name}
              userType="submitted"
            />
          )
        }

        return (
          <CommentList
            interval={intervalUserComments}
            onRefresh={refetch}
            sort={sortUserComments}
            user={params.name}
          />
        )
      }}
      renderTabBar={({ position }) => (
        <View style={styles.tabs}>
          <SegmentedControl
            items={routes.current.map(({ title }) => title)}
            offset={position}
            onChange={(next) => {
              setIndex(next)
            }}
          />
        </View>
      )}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  tabs: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
