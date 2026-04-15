import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { isPost } from '~/lib/guards'
import { prepareMarkdown } from '~/lib/markdown'
import { addPrefix, removePrefix } from '~/lib/reddit'
import { REDDIT_URI, reddit } from '~/reddit/api'
import { CreateCommentSchema } from '~/schemas/comments'
import { PostSchema } from '~/schemas/post'
import { transformComment } from '~/transformers/comment'
import { type Comment } from '~/types/comment'

type Variables = {
  commentId?: string
  postId: string
  text: string
}

export function usePostReply() {
  const t = useTranslations('toasts.comments')

  const { isPending, mutateAsync } = useMutation<
    Comment | undefined,
    Error,
    Variables
  >({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('api_type', 'json')
      body.append('text', prepareMarkdown(variables.text))
      body.append(
        'thing_id',
        addPrefix(
          variables.commentId ?? variables.postId,
          variables.commentId ? 'comment' : 'link',
        ),
      )

      const comment = CreateCommentSchema.parse(
        await reddit({
          body,
          method: 'post',
          url: '/api/comment',
        }),
      )

      if (comment.json.errors.length > 0) {
        const error = comment.json.errors[0]?.[1] ?? t('error')

        throw new Error(error)
      }

      const payload = comment.json.data?.things[0]?.data

      if (!payload) {
        return
      }

      const url = new URL(
        `/comments/${removePrefix(payload.link)}/comment/${removePrefix(payload.id)}`,
        REDDIT_URI,
      )

      url.searchParams.set('sr_detail', 'true')

      const comments = PostSchema.parse(
        await reddit({
          url,
        }),
      )

      const data = comments[1].data.children.map((item) =>
        transformComment(item),
      )

      return data.find((item) => item.data.id === payload.id)
    },
    onError(error) {
      toast.error(error.message)
    },
    onMutate(variables) {
      updatePost(variables.postId, (draft) => {
        draft.post.comments += 1
      })

      updatePosts(variables.postId, (draft) => {
        if (isPost(draft)) {
          draft.comments += 1
        }
      })

      updateSearch(variables.postId, (draft) => {
        draft.comments += 1
      })
    },
    onSuccess(data, variables) {
      if (data) {
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
      }

      toast.success(t('created'))
    },
  })

  return {
    isPending,
    reply: mutateAsync,
  }
}
