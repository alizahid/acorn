import { type FeedType } from '~/hooks/queries/posts/posts'

export function getPostUrl(postId: string, feedType?: FeedType) {
  let url = `/posts/${postId}`

  if (feedType) {
    url += `?feedType=${feedType}`
  }

  return url
}
