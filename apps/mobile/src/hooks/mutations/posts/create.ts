import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { compact } from 'lodash'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { reddit } from '~/reddit/api'
import { type Submission } from '~/types/submission'

export type CreatePostForm = {
  community: string
  flairId?: string
  nsfw: boolean
  spoiler: boolean
  title: string
} & (
  | {
      text: string
      type: 'text'
    }
  | {
      type: 'image'
      url: string
    }
  | {
      type: 'link'
      url: string
    }
)

export function useCreatePost(submission: Submission) {
  const data = z.object({
    community: z.string(),
    flairId: z.string().optional(),
    nsfw: z.boolean(),
    spoiler: z.boolean(),
    title: z
      .string()
      .min(submission.rules.titleMinLength ?? 1)
      .max(submission.rules.titleMaxLength ?? 300),
  })

  const types = compact([
    submission.media.text && 'text',
    submission.media.image && 'image',
    // submission.media.video && 'video',
    submission.media.link && 'link',
  ] as const)

  const schema = z.discriminatedUnion('type', [
    z
      .object({
        text: z
          .string()
          .min(submission.rules.bodyMinLength ?? 1)
          .max(submission.rules.bodyMaxLength ?? Infinity),
        type: z.literal('text'),
      })
      .merge(data),
    z
      .object({
        type: z.literal('link'),
        url: z.string().url(),
      })
      .merge(data),
    z
      .object({
        type: z.literal('image'),
        url: z.string().url(),
      })
      .merge(data),
  ])

  const form = useForm<CreatePostForm>({
    defaultValues: {
      community: submission.community.name,
      nsfw: false,
      spoiler: false,
      title: '',
      type: types[0],
    },
    resolver: zodResolver(schema),
  })

  const { isPending, mutateAsync } = useMutation<string, Error, CreatePostForm>(
    {
      async mutationFn(variables) {
        const body = new FormData()

        body.append('api_type', 'json')
        body.append('sr', variables.community)
        body.append('title', variables.title)
        body.append('spoiler', String(variables.spoiler))
        body.append('nsfw', String(variables.nsfw))

        body.append(
          'kind',
          variables.type === 'image'
            ? 'image'
            : variables.type === 'link'
              ? 'link'
              : 'self',
        )

        if (variables.type === 'text') {
          body.append('text', variables.text)
        } else {
          body.append('url', variables.url)
        }

        if (variables.flairId) {
          body.append('flair_id', variables.flairId)
        }

        const response = await reddit({
          body,
          method: 'post',
          url: '/api/submit',
        })

        const { json } = responseSchema.parse(response)

        return json.data.id
      },
    },
  )

  return {
    createPost: mutateAsync,
    form,
    isPending,
  }
}

const responseSchema = z.object({
  json: z.object({
    data: z.object({
      id: z.string(),
    }),
  }),
})
