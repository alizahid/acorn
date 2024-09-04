import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useRef } from 'react'
import Pager from 'react-native-pager-view'
import { useSharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { UserCommentsList } from '~/components/users/comments'
import { UserHeader } from '~/components/users/header'
import { UserPostsList } from '~/components/users/posts'
import { useProfile } from '~/hooks/queries/user/profile'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { refetch } = useProfile(params.name)

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  const offset = useSharedValue(0)

  useFocusEffect(() => {
    navigation.setOptions({
      header: (props: NativeStackHeaderProps) => (
        <UserHeader
          {...props}
          offset={offset}
          onChange={(next) => {
            pager.current?.setPage(next)
          }}
          username={params.name}
        />
      ),
      title: params.name,
    })
  })

  return (
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
        username={params.name}
      />
    </Pager>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: {
    flex: 1,
  },
}))
