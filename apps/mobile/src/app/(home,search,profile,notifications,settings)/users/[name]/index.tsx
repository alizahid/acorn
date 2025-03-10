import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { TabView } from 'react-native-tab-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon-button'
import { Loading } from '~/components/common/loading'
import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { Header } from '~/components/navigation/header'
import { PostList } from '~/components/posts/list'
import { ListFlags, useList } from '~/hooks/list'
import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { UserTab } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export type UserParams = z.infer<typeof schema>

const routes = UserTab.map((key) => ({
  key,
  title: key,
}))

export default function Screen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const {
    intervalUserComments,
    intervalUserPosts,
    sortUserComments,
    sortUserPosts,
  } = usePreferences()

  const t = useTranslations('screen.users.user')

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList(ListFlags.ALL, {
    top: theme.space[7] + theme.space[4],
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
      renderLazyPlaceholder={() => <Loading />}
      renderScene={({ route }) => {
        if (route.key === 'posts') {
          return (
            <PostList
              interval={intervalUserPosts}
              listProps={listProps}
              sort={sortUserPosts}
              style={styles.list}
              user={params.name}
              userType="submitted"
            />
          )
        }

        return (
          <PostList
            interval={intervalUserComments}
            listProps={listProps}
            sort={sortUserComments}
            style={styles.list}
            user={params.name}
            userType="comments"
          />
        )
      }}
      renderTabBar={({ position }) => (
        <Header
          back
          right={
            <IconButton
              icon={{
                name: 'Info',
                weight: 'duotone',
              }}
              onPress={() => {
                router.push({
                  params: {
                    name: params.name,
                  },
                  pathname: '/users/[name]/about',
                })
              }}
            />
          }
          title={params.name}
        >
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

const stylesheet = createStyleSheet((theme) => ({
  list: {
    padding: iPad ? theme.space[4] : 0,
  },
}))
