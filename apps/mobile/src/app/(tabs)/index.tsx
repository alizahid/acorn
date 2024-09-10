import { PostList } from '~/components/posts/list'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
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
