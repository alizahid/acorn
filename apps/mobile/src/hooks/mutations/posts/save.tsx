import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { updateSearch } from '~/hooks/queries/search/search'
import { triggerFeedback } from '~/lib/feedback'
import { isPost } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { usePreferences } from '~/stores/preferences'

import { usePostVote } from './vote'

type Variables = {
  action: 'save' | 'unsave'
  postId: string
}

export function usePostSave() {
  const t = useTranslations('toasts.posts')

  const { upvoteOnSave } = usePreferences()

  const { vote } = usePostVote()

  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const body = new FormData()

      body.append('id', addPrefix(variables.postId, 'link'))

      await reddit({
        body,
        method: 'post',
        url: `/api/${variables.action}`,
      })
    },
    onMutate(variables) {
      if (upvoteOnSave && variables.action === 'save') {
        vote({
          direction: 1,
          postId: variables.postId,
        })
      }

      triggerFeedback(variables.action === 'save' ? 'save' : 'undo')

      updatePost(variables.postId, (draft) => {
        draft.post.saved = variables.action === 'save'
      })

      updatePosts(variables.postId, (draft) => {
        if (isPost(draft)) {
          draft.saved = variables.action === 'save'
        }
      })

      updateSearch(variables.postId, (draft) => {
        draft.saved = variables.action === 'save'
      })
    },
    onSuccess(_data, variables) {
      toast.success(t(variables.action === 'save' ? 'saved' : 'unsaved'), {
        icon: (
          <Icon
            name={variables.action === 'save' ? 'bookmark.fill' : 'bookmark'}
            uniProps={(theme) => ({
              tintColor: theme.colors.green.accent,
            })}
          />
        ),
      })
    },
  })

  return {
    isPending,
    save: mutate,
  }
}
