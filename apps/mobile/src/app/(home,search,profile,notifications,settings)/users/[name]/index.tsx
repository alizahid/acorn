import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentList } from '~/components/comments/list'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import { UserAbout } from '~/components/users/about'
import { useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { UserTab } from '~/types/user'

const schema = z.object({
  mode: z.literal('headless').optional(),
  name: z.string().catch('mildpanda'),
})

export type UserParams = z.infer<typeof schema>

const routes = UserTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const {
    intervalUserComments,
    intervalUserPosts,
    sortUserComments,
    sortUserPosts,
  } = usePreferences()

  const t = useTranslations('screen.users.user')

  const { theme } = useStyles()

  const listProps = useList({
    padding: iPad ? theme.space[4] : 0,
    top: params.mode === 'headless' ? 0 : theme.space[7] + theme.space[4],
  })

  const [index, setIndex] = useState(0)

  return (
    <TabView
      lazy
      navigationState={{
        index,
        routes,
      }}
      onIndexChange={setIndex}
      renderLazyPlaceholder={Loading}
      renderScene={({ route }) => {
        if (route.key === 'posts') {
          return (
            <PostList
              interval={intervalUserPosts}
              label="subreddit"
              listProps={listProps}
              sort={sortUserPosts}
              user={params.name}
              userType="submitted"
            />
          )
        }

        if (route.key === 'comments') {
          return (
            <CommentList
              interval={intervalUserComments}
              listProps={listProps}
              sort={sortUserComments}
              user={params.name}
            />
          )
        }

        return <UserAbout listProps={listProps} name={params.name} />
      }}
      renderTabBar={({ position }) => (
        <Header back title={params.name}>
          <View gap="4" pb="4" px="3">
            <SegmentedControl
              items={routes.map(({ key }) => t(`tabs.${key}`))}
              offset={position}
              onChange={(next) => {
                setIndex(next)
              }}
            />
          </View>
        </Header>
      )}
    />
  )
}
