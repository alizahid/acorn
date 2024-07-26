import { useFocusEffect, useNavigation } from 'expo-router'

import { PostHeader } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { feed, updatePreferences } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <PostHeader
          onChange={(next) => {
            updatePreferences({
              feed: next,
            })
          }}
          type={feed}
        />
      ),
    })
  })

  return <PostList type={feed} />
}
