import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { Tabs } from 'react-native-collapsible-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

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

export function UserScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.users.user')

  const { profile, refetch } = useProfile(params.name)
  const { follow, isPending } = useFollow()

  const { styles } = useStyles(stylesheet)

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
      title: params.name,
    })
  })

  return (
    <Tabs.Container
      lazy
      renderTabBar={({ indexDecimal, onTabPress }) => (
        <View style={styles.tabs}>
          <SegmentedControl
            items={UserTab.map((tab) => t(tab))}
            offset={indexDecimal}
            onChange={(index) => {
              const next = UserTab[index]

              if (next) {
                onTabPress(next)
              }
            }}
          />
        </View>
      )}
    >
      <Tabs.Tab name="posts">
        <UserPostsList
          label="subreddit"
          onRefresh={refetch}
          sort="new"
          tabs
          type="submitted"
          username={params.name}
        />
      </Tabs.Tab>

      <Tabs.Tab name="comments">
        <UserCommentsList
          onRefresh={refetch}
          sort="new"
          tabs
          username={params.name}
        />
      </Tabs.Tab>
    </Tabs.Container>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    shadowColor: 'transparent',
  },
  main: {
    flex: 1,
  },
  tabs: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[4],
    paddingHorizontal: theme.space[3],
  },
}))
