import { PostList } from '~/components/posts/list'
import { usePreferences } from '~/stores/preferences'

export function HomeScreen() {
  const { feedType, intervalFeedPosts, sortFeedPosts } = usePreferences()

  return (
    <PostList
      community={feedType === 'home' ? undefined : feedType}
      interval={intervalFeedPosts}
      label="subreddit"
      sort={sortFeedPosts}
    />
  )
}
