import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { compact } from 'lodash'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { prepareMarkdown } from '~/lib/markdown'
import { REDDIT_OLD_URI, reddit } from '~/reddit/api'
import {
  SubmissionResponseSchema,
  SubmissionSocketSchema,
} from '~/schemas/submission'
import { type Submission } from '~/types/submission'

export type CreatePostForm = z.infer<ReturnType<typeof generateSchema>>

export function useCreatePost(submission: Submission) {
  const t = useTranslations('component.submission')

  const types = compact([
    submission.media.text && 'text',
    submission.media.image && 'image',
    // submission.media.video && 'video',
    submission.media.link && 'link',
  ] as const)

  const schema = useMemo(() => generateSchema(), [])

  const form = useForm({
    defaultValues: {
      community: submission.community.name,
      nsfw: false,
      spoiler: false,
      title: '',
      type: types[0],
    },
    resolver: zodResolver(schema),
  })

  const { isPending, mutateAsync } = useMutation<
    | {
        id: string
      }
    | {
        url: string
      },
    Error,
    CreatePostForm
  >({
    async mutationFn(variables) {
      const body = new FormData()

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
        body.append('text', prepareMarkdown(variables.text))
      } else {
        body.append('url', variables.url)
      }

      if (variables.flairId) {
        body.append('flair_id', variables.flairId)
      }

      const url = new URL('/api/submit', REDDIT_OLD_URI)

      url.searchParams.append('api_type', 'json')

      const response = await reddit({
        body,
        method: 'post',
        url,
      })

      const { json } = SubmissionResponseSchema.parse(response)

      if ('errors' in json) {
        throw new Error(
          json.errors[0]
            ? `${json.errors[0][1]}: ${json.errors[0][2]}`
            : undefined,
        )
      }

      if ('id' in json.data) {
        return {
          id: json.data.id,
        }
      }

      return handleSocket(json.data.websocket_url)
    },
    onError(error) {
      toast.error(t('toast.error'), {
        description: error.message,
      })
    },
    onSuccess() {
      toast.success(t('toast.created'))
    },
  })

  return {
    createPost: mutateAsync,
    form,
    isPending,
  }
}

function generateSchema() {
  const base = z.object({
    community: z.string(),
    flairId: z.string().optional(),
    nsfw: z.boolean(),
    spoiler: z.boolean(),
    title: z.string().min(1),
  })

  return z.discriminatedUnion('type', [
    z
      .object({
        text: z.string().min(1),
        type: z.literal('text'),
      })
      .extend(base.shape),
    z
      .object({
        type: z.literal('link'),
        url: z.url().min(1),
      })
      .extend(base.shape),
    z
      .object({
        type: z.literal('image'),
        url: z.url({
          hostname: imageHostRegex,
        }),
      })
      .extend(base.shape),
  ])
}

const imageHostRegex = /reddit-uploaded-media.s3-accelerate.amazonaws.com/

function handleSocket(url: string) {
  return new Promise<{
    url: string
  }>((resolve, reject) => {
    const socket = new WebSocket(url)

    socket.onmessage = (event) => {
      const { payload } = SubmissionSocketSchema.parse(
        JSON.parse(event.data as string),
      )

      resolve({
        url: payload.redirect,
      })
    }

    socket.onerror = () => {
      reject(new Error('Error'))
    }
  })
}
