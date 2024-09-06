import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useRef } from 'react'
import Pager from 'react-native-pager-view'
import { useSharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { SegmentedControl } from '~/components/common/segmented-control'
import { HeaderButton } from '~/components/navigation/header-button'
import { UserCommentsList } from '~/components/users/comments'
import { UserPostsList } from '~/components/users/posts'
import { useFollow } from '~/hooks/mutations/users/follow'
import { useProfile } from '~/hooks/queries/user/profile'
import { UserTab } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.users.user')

  const { profile, refetch } = useProfile(params.name)
  const { follow, isPending } = useFollow()

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  const offset = useSharedValue(0)

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
        ) : null,
      title: params.name,
    })
  })

  return (
    <>
      <SegmentedControl
        items={UserTab.map((tab) => t(tab))}
        offset={offset}
        onChange={(next) => {
          pager.current?.setPage(next)
        }}
      />

      <Pager
        onPageScroll={(event) => {
          offset.value = event.nativeEvent.offset + event.nativeEvent.position
        }}
        ref={pager}
        style={styles.main}
      >
        <UserPostsList
          inset
          key="posts"
          label="subreddit"
          onRefresh={refetch}
          sort="new"
          type="submitted"
          username={params.name}
        />

        <UserCommentsList
          inset
          key="comments"
          onRefresh={refetch}
          sort="new"
          username={params.name}
        />
      </Pager>
    </>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: {
    flex: 1,
  },
}))
