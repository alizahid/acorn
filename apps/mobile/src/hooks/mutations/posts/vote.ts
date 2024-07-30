import { useMutation } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import { type PostsQueryData } from '~/hooks/queries/posts/posts'
import { TYPE_LINK } from '~/lib/const'
import { queryClient } from '~/lib/query'
import { redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  direction: 1 | 0 | -1
  postId: string
}

export function usePostVote() {
  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', `${TYPE_LINK}${variables.postId}`)
      body.append('dir', String(variables.direction))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: '/api/vote',
      })
    },
    onMutate(variables) {
      queryClient.setQueryData<PostQueryData>(
        ['post', variables.postId] satisfies PostQueryKey,
        (data) => {
          if (!data) {
            return data
          }

          return create(data, (draft) => {
            draft.post.votes =
              draft.post.votes -
              (draft.post.liked ? 1 : draft.post.liked === null ? 0 : -1) +
              variables.direction

            draft.post.liked =
              variables.direction === 1
                ? true
                : variables.direction === 0
                  ? null
                  : false
          })
        },
      )

      updateAll(variables)
    },
  })

  return {
    isPending,
    vote: mutate,
  }
}

function updateAll(variables: Variables) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts'],
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData>(query.queryKey, (data) => {
      if (!data) {
        return data
      }

      return create(data, (draft) => {
        let found = false

        for (const page of draft.pages) {
          if (found) {
            break
          }

          for (const item of page.posts) {
            if (item.id === variables.postId) {
              item.votes =
                item.votes -
                (item.liked ? 1 : item.liked === null ? 0 : -1) +
                variables.direction

              item.liked =
                variables.direction === 1
                  ? true
                  : variables.direction === 0
                    ? null
                    : false

              found = true

              break
            }
          }
        }
      })
    })
  }
}
