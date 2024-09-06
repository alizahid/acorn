import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { TopIntervalMenu } from '~/components/posts/interval'
import { FeedSortMenu } from '~/components/posts/sort'
import { UserPostsList } from '~/components/users/posts'
import { usePreferences } from '~/stores/preferences'
import { UserFeedType } from '~/types/user'

const schema = z.object({
  name: z.string().catch('mildpanda'),
  type: z.enum(UserFeedType).catch('submitted'),
})

export default function Screen() {
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('tab.user.menu')

  const { intervalUserPosts, sortUserPosts, update } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FeedSortMenu
            hideLabel
            onChange={(next) => {
              update({
                sortUserPosts: next,
              })
            }}
            type="user"
            value={sortUserPosts}
          />

          {sortUserPosts === 'top' ? (
            <TopIntervalMenu
              hideLabel
              onChange={(next) => {
                update({
                  intervalUserPosts: next,
                })
              }}
              value={intervalUserPosts}
            />
          ) : null}
        </>
      ),
      title: t(params.type),
    })
  })

  return (
    <UserPostsList
      inset
      interval={intervalUserPosts}
      label="subreddit"
      sort={sortUserPosts}
      type={params.type}
      username={params.name}
    />
  )
}
