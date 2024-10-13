import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { z } from 'zod'

import { CommentsSortMenu } from '~/components/comments/sort'
import { TopIntervalMenu } from '~/components/posts/interval'
import { UserCommentsList } from '~/components/users/comments'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  name: z.string().catch('mildpanda'),
})

export default function UserCommentsScreen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { intervalUserComments, sortUserComments, update } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <CommentsSortMenu
            hideLabel
            onChange={(next) => {
              update({
                sortUserComments: next,
              })
            }}
            value={sortUserComments}
          />

          {sortUserComments === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={(next) => {
                update({
                  intervalUserComments: next,
                })
              }}
              value={intervalUserComments}
            />
          ) : null}
        </>
      ),
      // title: t('comments'),
    })
  })

  return (
    <UserCommentsList
      interval={intervalUserComments}
      sort={sortUserComments}
      username={params.name}
    />
  )
}
