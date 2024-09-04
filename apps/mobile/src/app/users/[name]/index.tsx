import { useLocalSearchParams } from 'expo-router'
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
  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.users.user')

  const common = useCommon()

  const { profile } = useProfile(params.name)

  const { styles } = useStyles(stylesheet)

  const pager = useRef<Pager>(null)

  const [page, setPage] = useState(0)

  const header = profile ? <UserAboutCard profile={profile} /> : undefined

  return (
    <>
      <View p="4" style={styles.header(common.height.header)}>
        <SegmentedControl
          active={page}
          items={[t('posts'), t('comments')]}
          onChange={(index) => {
            pager.current?.setPage(index)
          }}
        />
      </View>

      <Pager
        onPageSelected={(event) => {
          setPage(event.nativeEvent.position)
        }}
        ref={pager}
        style={styles.main}
      >
        <UserPostsList
          header={header}
          insets={['bottom']}
          key="posts"
          label="subreddit"
          sort="new"
          type="submitted"
          username={params.name}
        />

        <UserCommentsList
          header={header}
          insets={['bottom']}
          key="comments"
          user={params.name}
        />
      </Pager>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: (top: number) => ({
    backgroundColor: theme.colors.gray.a3,
    marginTop: top,
  }),
  main: {
    flex: 1,
  },
}))
