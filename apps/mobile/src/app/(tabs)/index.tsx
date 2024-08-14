import { useFocusEffect, useNavigation } from 'expo-router'

import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { interval, sort, update } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <FeedSortMenu
            onChange={(value) => {
              const next: Partial<PreferencesPayload> = {
                sort: value,
              }

              if (value === 'top') {
                next.interval = 'hour'
              } else {
                next.interval = undefined
              }

              update(next)
            }}
            value={sort}
          />

          {sort === 'top' ? (
            <TopIntervalMenu
              onChange={(next) => {
                update({
                  interval: next,
                })
              }}
              value={interval}
            />
          ) : null}
        </>
      ),
    })
  })

  return (
    <PostList
      insets={['top', 'bottom', 'header', 'tabBar']}
      interval={interval}
      label="subreddit"
      sort={sort}
    />
  )
}
