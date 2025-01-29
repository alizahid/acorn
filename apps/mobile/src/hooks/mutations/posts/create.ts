import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { compact } from 'lodash'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { reddit } from '~/reddit/api'
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

  const schema = useMemo(() => generateSchema(t, submission), [submission, t])

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

      const { json } = SubmissionResponseSchema.parse(response)

      if ('id' in json.data) {
        return {
          id: json.data.id,
        }
      }

      return handleSocket(json.data.websocket_url)
    },
  })

  return {
    createPost: mutateAsync,
    form,
    isPending,
  }
}

function generateSchema(
  t: ReturnType<typeof useTranslations<'component.submission'>>,
  submission: Submission,
) {
  const base = z.object({
    community: z.string(),
    flairId: z.string().optional(),
    nsfw: z.boolean(),
    spoiler: z.boolean(),
    title: z
      .string()
      .min(
        submission.rules.title.min ?? 1,
        t('title.error.min', {
          min: submission.rules.title.min ?? 1,
        }),
      )
      .max(
        submission.rules.title.max ?? 300,
        t('title.error.max', {
          max: submission.rules.title.max ?? 300,
        }),
      )
      .refine(
        (value) => {
          if (submission.rules.title.required.length > 0) {
            return submission.rules.title.required.every((word) =>
              value.toLowerCase().includes(word.toLowerCase()),
            )
          }

          return true
        },
        t('title.error.required', {
          list: submission.rules.title.required.join(', '),
        }),
      )
      .refine(
        (value) => {
          if (submission.rules.title.blacklist.length > 0) {
            return submission.rules.body.blacklist.every(
              (word) => !value.toLowerCase().includes(word.toLowerCase()),
            )
          }

          return true
        },
        t('title.error.blacklist', {
          list: submission.rules.title.blacklist.join(', '),
        }),
      ),
  })

  return z.discriminatedUnion('type', [
    z
      .object({
        text: z
          .string()
          .min(
            submission.rules.body.min ?? 1,
            t('text.error.min', {
              min: submission.rules.body.min ?? 1,
            }),
          )
          .max(
            submission.rules.body.max ?? Infinity,
            t('text.error.max', {
              max: submission.rules.body.max ?? Infinity,
            }),
          )
          .refine(
            (value) => {
              if (submission.rules.body.required.length > 0) {
                return submission.rules.body.required.every((word) =>
                  value.toLowerCase().includes(word.toLowerCase()),
                )
              }

              return true
            },
            t('text.error.required', {
              list: submission.rules.body.required.join(', '),
            }),
          )
          .refine(
            (value) => {
              if (submission.rules.body.blacklist.length > 0) {
                return submission.rules.body.blacklist.every(
                  (word) => !value.toLowerCase().includes(word.toLowerCase()),
                )
              }

              return true
            },
            t('text.error.blacklist', {
              list: submission.rules.body.blacklist.join(', '),
            }),
          ),
        type: z.literal('text'),
      })
      .merge(base),
    z
      .object({
        type: z.literal('link'),
        url: z
          .string()
          .url(t('link.error.url'))
          .min(1, t('link.error.url'))
          .refine(
            (value) => {
              const host = getHost(value)

              if (submission.rules.domains.whitelist.length > 0) {
                return submission.rules.domains.whitelist.includes(host)
              }

              return true
            },
            t('link.error.whitelist', {
              list: submission.rules.domains.whitelist.join(', '),
            }),
          )
          .refine(
            (value) => {
              const host = getHost(value)

              if (submission.rules.domains.blacklist.length > 0) {
                return !submission.rules.domains.blacklist.includes(host)
              }

              return true
            },
            t('link.error.blacklist', {
              list: submission.rules.domains.blacklist.join(', '),
            }),
          ),
      })
      .merge(base),
    z
      .object({
        type: z.literal('image'),
        url: z
          .string()
          .url()
          .refine((value) => {
            const host = getHost(value)

            return host === 'reddit-uploaded-media.s3-accelerate.amazonaws.com'
          }, t('image.error.url')),
      })
      .merge(base),
  ])
}

function getHost(link: string) {
  try {
    const url = new URL(link)

    return url.hostname
  } catch {
    return ''
  }
}

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
      reject(new Error())
    }
  })
}
