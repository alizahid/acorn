import { useQuery } from '@tanstack/react-query'

import { queryClient } from '~/lib/query'
import { REDDIT_URI, redditApi } from '~/lib/reddit'
import { PostSchema } from '~/schemas/reddit/post'
import { useAuth } from '~/stores/auth'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'

import { type PostsQueryData } from './posts'

export type PostQueryKey = ['post', string]

export type PostQueryData = {
  comments: Array<Comment>
  post: Post
}

export function usePost(id?: string) {
  const { accessToken, expired } = useAuth()

  const { data, isFetching, isRefetching, refetch } = useQuery<
    PostQueryData,
    Error,
    PostQueryData | undefined,
    PostQueryKey
  >({
    enabled: !expired && Boolean(id),
    initialData() {
      return getPost(id)
    },
    async queryFn() {
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
        post: transformPost(post.data),
      }
    },
    queryKey: ['post', id!],
    staleTime(query) {
      if (!query.state.data) {
        return 0
      }

      if (
        query.state.data.comments.length === 0 &&
        query.state.data.post.comments > 0
      ) {
        return 0
      }

      return Infinity
    },
  })

  return {
    comments: data?.comments ?? [],
    isFetching,
    isRefetching,
    post: data?.post,
    refetch,
  }
}

function getPost(id?: string) {
  if (!id) {
    return
  }

  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
  })

  for (const query of queries) {
    const data = query.state.data as PostsQueryData | undefined

    if (!data) {
      continue
    }

    for (const page of data.pages) {
      for (const post of page.posts) {
        if (post.id === id) {
          return {
            comments: [],
            post,
          }
        }
      }
    }
  }
}
