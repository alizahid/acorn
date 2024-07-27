import { useQuery } from '@tanstack/react-query'
import { compact } from 'lodash'

import { REDDIT_URI } from '~/lib/const'
import { redditApi } from '~/lib/reddit'
import { PostSchema } from '~/schemas/reddit/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type PostWithComments } from '~/types/post'

export type PostQueryKey = ['post', string]

export type PostQueryData = PostWithComments

export function usePost(id?: string) {
  const { accessToken, expired } = useAuth()

  const { data, isLoading, isRefetching, refetch } = useQuery<
    PostQueryData,
    Error,
    PostQueryData | undefined,
    PostQueryKey
  >({
    enabled: !expired && Boolean(id),
    async queryFn() {
      const url = new URL(`/comments/${String(id)}`, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('threaded', 'false')
      url.searchParams.set('depth', '3')

      const payload = await redditApi({
        accessToken,
        url,
      })

      const response = PostSchema.parse(payload, {})

      return {
        comments: compact(
          response[1].data.children.map((item) => transformComment(item)),
        ),
        post: transformPost(response[0].data.children[0]),
      } satisfies PostQueryData
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
