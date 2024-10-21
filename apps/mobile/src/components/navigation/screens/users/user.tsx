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

import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { UserCommentsList } from '~/components/users/comments'
import { UserPostsList } from '~/components/users/posts'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { UserTab } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export type UserParams = z.infer<typeof schema>

export function UserScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

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
            <UserPostsList
              label="subreddit"
              onRefresh={refetch}
              sort="new"
              type="submitted"
              username={params.name}
            />
          )
        }

        return (
          <UserCommentsList
            onRefresh={refetch}
            sort="new"
            username={params.name}
          />
        )
      }}
      renderTabBar={({ position }) => {
        return (
          <View style={styles.tabs}>
            <SegmentedControl
              items={routes.current.map(({ title }) => title)}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        )
      }}
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
