import { type Comment } from '@acorn/reddit'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { isPost } from '~/lib/guards'
import { prepareMarkdown } from '~/lib/markdown'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

type Variables = {
  commentId?: string
  postId: string
  text: string
}

export function usePostReply() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutateAsync } = useMutation<Comment, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      return reddit.comments.create({
        body: prepareMarkdown(variables.text),
        parentId: variables.commentId
          ? addPrefix(variables.commentId, 'comment')
          : undefined,
        postId: addPrefix(variables.postId, 'link'),
      })
    },
    onError(error) {
      toast.error(error.message)
    },
    onMutate(variables) {
      const postId = addPrefix(variables.postId, 'link')

      updatePost(postId, (draft) => {
        draft.post.comments += 1
      })

      updatePosts(postId, (draft) => {
        if (isPost(draft)) {
          draft.comments += 1
        }
      })

      updateSearch(postId, (draft) => {
        draft.comments += 1
      })
    },
    onSuccess(data, variables) {
      updatePost(variables.postId, (draft) => {
        if (data.data.parentId) {
          const index = draft.comments.findIndex(
            (item) => item.data.id === data.data.parentId,
          )

          const parent = draft.comments[index]

          if (!parent) {
            return
          }

          data.data.depth = parent.data.depth + 1

          draft.comments.splice(index + 1, 0, data)
        } else {
          draft.comments.unshift(data)
        }
      })

      toast.success(t('created'))
    },
  })

  return {
    isPending,
    reply: mutateAsync,
  }
}
