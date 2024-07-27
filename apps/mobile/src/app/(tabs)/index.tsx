import { useFocusEffect, useNavigation } from 'expo-router'

import { FeedTypeMenu, TopIntervalMenu } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import { type PreferencesPayload, usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { feed, interval, updatePreferences } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <FeedTypeMenu
            onChange={(nextFeed) => {
              const next: Partial<PreferencesPayload> = {
                feed: nextFeed,
              }

              if (nextFeed === 'top') {
                next.interval = 'hour'
              } else {
                next.interval = undefined
              }

              updatePreferences(next)
            }}
            type={feed}
          />

          {feed === 'top' ? (
            <TopIntervalMenu
              interval={interval}
              onChange={(next) => {
                updatePreferences({
                  interval: next,
                })
              }}
            />
          ) : null}
        </>
      ),
    })
  })

  return <PostList interval={interval} type={feed} />
}
