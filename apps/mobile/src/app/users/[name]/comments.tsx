import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useState } from 'react'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { CommentsSortMenu } from '~/components/comments/sort'
import { TopIntervalMenu } from '~/components/posts/interval'
import { UserCommentsList } from '~/components/users/comments'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('tab.user.menu')

  const { userCommentSort, userInterval } = usePreferences()

  const [sort, setSort] = useState(userCommentSort)
  const [interval, setInterval] = useState(userInterval)

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <CommentsSortMenu hideLabel onChange={setSort} value={sort} />

          {sort === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={setInterval}
              value={interval}
            />
          ) : null}
        </>
      ),
      title: t('comments'),
    })
  })

  return (
    <UserCommentsList
      insets={['top', 'bottom', 'header']}
      username={params.name}
    />
  )
}
