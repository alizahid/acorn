import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { compact } from 'lodash'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { prepareMarkdown } from '~/lib/markdown'
import { removePrefix } from '~/lib/reddit'
import { sleep } from '~/lib/sleep'
import { REDDIT_OLD_URI, REDDIT_URI, reddit } from '~/reddit/api'
import { type PostsSchema } from '~/schemas/posts'
import { SubmissionResponseSchema } from '~/schemas/submission'
import { useAuth } from '~/stores/auth'
import { type Undefined } from '~/types'
import { type Submission, type SubmissionType } from '~/types/submission'

export type CreatePostForm = z.infer<ReturnType<typeof generateSchema>>

export function useCreatePost(submission: Submission) {
  const t = useTranslations('component.submission')

  const { accountId } = useAuth((state) => ({
    accountId: state.accountId,
  }))

  const types: Array<SubmissionType> = compact([
    submission.media.text && 'text',
    submission.media.image && 'image',
    submission.media.video && 'video',
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
    Undefined<{
      id: string
    }>,
    Error,
    CreatePostForm
  >({
    async mutationFn(variables) {
      if (!accountId) {
        throw new Error(t('account.error'))
      }
      const body = new URLSearchParams()

      body.append('sr', variables.community)
      body.append('title', variables.title)
      body.append('spoiler', String(variables.spoiler))
      body.append('nsfw', String(variables.nsfw))
      body.append('kind', variables.type === 'text' ? 'self' : variables.type)

      if (variables.type === 'video') {
        body.append('video_poster_url', variables.posterUrl)
      }

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

      return handleAsync(accountId, variables.title)
    },
    onError(error) {
      toast.error(t('toast.error'), {
        description: error.message,
      })
    },
    onSuccess(data) {
      if (data?.id) {
        toast.success(t('toast.created'))
      } else {
        toast.success(t('toast.noId'))
      }
    },
  })

  return {
    createPost: mutateAsync,
    form,
    isPending,
    types,
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
    z
      .object({
        posterUrl: z.url({
          hostname: imageHostRegex,
        }),
        type: z.literal('video'),
        url: z.url({
          hostname: videoHostRegex,
        }),
      })
      .extend(base.shape),
  ])
}

const imageHostRegex = /reddit-uploaded-media.s3-accelerate.amazonaws.com/
const videoHostRegex = /reddit-uploaded-video.s3-accelerate.amazonaws.com/

async function handleAsync(accountId: string, title: string, tries = 5) {
  const url = new URL(`/user/${accountId}/submitted`, REDDIT_URI)

  url.searchParams.set('limit', '5')
  url.searchParams.set('sort', 'new')

  const posts = await reddit<PostsSchema>({
    url,
  })

  for (const post of posts?.data.children ?? []) {
    if (post.data.title === title) {
      return {
        id: removePrefix(post.data.id),
      }
    }
  }

  if (tries > 1) {
    await sleep(3000)

    return handleAsync(accountId, title, tries - 1)
  }
}
