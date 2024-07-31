import { useFocusEffect, useNavigation } from 'expo-router'

import { TopIntervalMenu } from '~/components/posts/interval'
import { PostList } from '~/components/posts/list'
import { FeedSortMenu } from '~/components/posts/sort'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { interval, sort, updatePreferences } = usePreferences()

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

              updatePreferences(next)
            }}
            value={sort}
          />

          {sort === 'top' ? (
            <TopIntervalMenu
              onChange={(next) => {
                updatePreferences({
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

  return <PostList interval={interval} sort={sort} />
}
