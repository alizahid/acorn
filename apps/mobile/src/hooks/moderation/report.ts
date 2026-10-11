import { type enums } from '@acorn/reddit'
import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'

import { db } from '~/db'
import { updatePost } from '~/hooks/queries/posts/post'
import { updatePosts } from '~/hooks/queries/posts/posts'
import { isPost } from '~/lib/guards'
import { addPrefix } from '~/lib/reddit'
import { createApi } from '~/reddit/api'

export type ReportReason =
  | 'community'
  | 'HARASSMENT'
  | 'VIOLENCE'
  | 'HATE_CONTENT'
  | 'MINOR_ABUSE_OR_SEXUALIZATION'
  | 'PII'
  | 'INVOLUNTARY_PORN'
  | 'PROHIBITED_SALES'
  | 'IMPERSONATION'
  | 'COPYRIGHT'
  | 'TRADEMARK'
  | 'SELF_HARM'
  | 'SPAM'
  | 'CONTRIBUTOR_PROGRAM'

type Variables = {
  id: string
  reason: ReportReason
} & (
  | {
      postId: string
      type: 'comment'
    }
  | {
      type: 'post'
    }
)

const rules = {
  CONTRIBUTOR_PROGRAM: 'OTHER',
  COPYRIGHT: 'COPYRIGHT_OTHER',
  community: 'SUBREDDIT',
  HARASSMENT: 'HARASSMENT_AT_SOMEONE_ELSE',
  HATE_CONTENT: 'HATE_CONTENT',
  IMPERSONATION: 'IMPERSONATION_OTHER',
  INVOLUNTARY_PORN: 'INVOLUNTARY_PORN_OTHER',
  MINOR_ABUSE_OR_SEXUALIZATION: 'MINOR_ABUSE_OR_SEXUALIZATION_ABUSE',
  PII: 'PII_ABOUT_SOMEONE_ELSE',
  PROHIBITED_SALES: 'PROHIBITED_SALES',
  SELF_HARM: 'SELF_HARM',
  SPAM: 'SPAM_OTHER',
  TRADEMARK: 'TRADEMARK_OTHER',
  VIOLENCE: 'VIOLENCE_AT_SOMEONE_ELSE',
} as const satisfies Record<ReportReason, enums.RuleID>

export function useReport() {
  const { isPending, mutate } = useMutation<unknown, Error, Variables>({
    async mutationFn(variables) {
      const reddit = await createApi()

      if (variables.type === 'comment') {
        await reddit.comments.report({
          id: addPrefix(variables.id, 'comment'),
          siteRule: rules[variables.reason],
        })
      } else {
        await reddit.posts.report({
          id: addPrefix(variables.id, 'link'),
          siteRule: rules[variables.reason],
        })
      }
    },
    async onMutate(variables) {
      if (variables.type === 'comment') {
        updatePost(variables.postId, (draft) => {
          const index = draft.comments.findIndex(
            (comment) => comment.data.id === variables.id,
          )

          draft.comments.splice(index, 1)
        })
      }

      if (variables.type === 'post') {
        updatePosts(
          variables.id,
          (draft) => {
            if (isPost(draft)) {
              draft.hidden = true
            }
          },
          true,
        )

        await db.insert(db.schema.filters).values({
          id: createId(),
          type: variables.type,
          value: variables.id,
        })
      }
    },
  })

  return {
    isPending,
    report: mutate,
  }
}
