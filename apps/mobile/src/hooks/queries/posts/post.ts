import { useQuery } from '@tanstack/react-query'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { PostSchema } from '~/schemas/reddit/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

export type PostQueryKey = ['post', string]

export type PostQueryData = {
  comments: Array<Comment>
  post: Post
}

export function usePost(id?: string) {
  const { accessToken, expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    PostQueryData,
    Error,
    PostQueryData | undefined,
    PostQueryKey
  >({
    enabled: !expired && Boolean(id),
    async queryFn({ pageParam }) {
      const url = new URL(`/comments/${String(id)}`, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('threaded', 'false')

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = PostSchema.parse(payload)

      const post = response[0].data.children[0]
      const comments = response[1].data.children

      return {
        comments: comments.map((item) => transformComment(item)),
        post: (pageParam ? null : transformPost(post.data))!,
      }
    },
    queryKey: ['post', id!],
  })

  return {
    comments: data?.comments ?? [],
    isLoading,
    isRefetching,
    post: data?.post,
    refetch,
  }
}
