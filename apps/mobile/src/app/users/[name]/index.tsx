import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useRef, useState } from 'react'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { SegmentedControl } from '~/components/common/segmented-control'
import { View } from '~/components/common/view'
import { UserAboutCard } from '~/components/users/about'
import { UserCommentsList } from '~/components/users/comments'
import { UserPostsList } from '~/components/users/posts'
import { useCommon } from '~/hooks/common'
import { useProfile } from '~/hooks/queries/user/profile'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.users.user')

  const common = useCommon()

  const { profile } = useProfile(params.name)

  const { styles } = useStyles(stylesheet)

  const pager = useRef<Pager>(null)

  const [page, setPage] = useState(0)

  useFocusEffect(() => {
    navigation.setOptions({
      title: params.name,
    })
  })

  return (
    <>
      {profile ? (
        <UserAboutCard
          profile={profile}
          style={styles.about(common.height.header)}
        />
      ) : null}

      <View p="4" style={styles.tabs(profile ? 0 : common.height.header)}>
        <SegmentedControl
          active={page}
          items={[t('posts'), t('comments')]}
          onChange={(index) => {
            pager.current?.setPage(index)

            setPage(index)
          }}
        />
      </View>

      <Pager
        initialPage={page}
        onPageSelected={(event) => {
          setPage(event.nativeEvent.position)
        }}
        ref={pager}
        style={styles.main}
      >
        <UserPostsList
          insets={['bottom']}
          key="posts"
          label="subreddit"
          sort="new"
          type="submitted"
          username={params.name}
        />

        <UserCommentsList
          insets={['bottom']}
          key="comments"
          user={params.name}
        />
      </Pager>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  about: (top: number) => ({
    marginTop: top,
  }),
  main: {
    flex: 1,
  },
  tabs: (top: number) => ({
    backgroundColor: theme.colors.gray.a3,
    marginTop: top,
  }),
}))
