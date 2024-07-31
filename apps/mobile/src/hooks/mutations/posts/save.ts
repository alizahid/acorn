import { useMutation } from '@tanstack/react-query'
import { create } from 'mutative'

import {
  type PostQueryData,
  type PostQueryKey,
} from '~/hooks/queries/posts/post'
import { type PostsQueryData } from '~/hooks/queries/posts/posts'
import { queryClient } from '~/lib/query'
import { addPrefix, redditApi } from '~/lib/reddit'
import { useAuth } from '~/stores/auth'

type Variables = {
  action: 'save' | 'unsave'
  postId: string
}

export function usePostSave() {
  const { accessToken, expired } = useAuth()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      if (expired) {
        return
      }

      const body = new FormData()

      body.append('id', addPrefix(variables.postId, 'link'))

      await redditApi({
        accessToken,
        body,
        method: 'post',
        url: `/api/${variables.action}`,
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
            draft.post.saved = variables.action === 'save'
          })
        },
      )

      updateAll(variables)
    },
  })

  return {
    isPending,
    save: mutate,
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
              item.saved = variables.action === 'save'

              found = true

              break
            }
          }
        }
      })
    })
  }
}
