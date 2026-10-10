import { type Submission, type SubmissionRequirements } from '@acorn/reddit'
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
import { createApi } from '~/reddit/api'
import { type SubmissionType } from '~/types/submission'

export type CreatePostForm = z.infer<ReturnType<typeof generateSchema>>

export function useCreatePost(submission: Submission) {
  const t = useTranslations('component.submission')

  const types: Array<SubmissionType> = compact([
    submission.media.text && 'text',
    submission.media.image && 'image',
    submission.media.video && 'video',
    submission.media.link && 'link',
  ] as const)

  const schema = useMemo(() => generateSchema(t, submission), [submission, t])

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
    {
      id: string
    },
    Error,
    CreatePostForm
  >({
    async mutationFn(variables) {
      const reddit = await createApi()

      // single images and videos are posted by their uploaded url
      const { id } = await reddit.posts.create({
        body:
          variables.type === 'text' && variables.text
            ? prepareMarkdown(variables.text)
            : undefined,
        // leaving it out posts to the signed-in user's profile
        community: submission.community.user ? undefined : variables.community,
        flair: variables.flairId
          ? {
              id: variables.flairId,
            }
          : undefined,
        images:
          variables.type === 'image'
            ? [
                {
                  id: '',
                  url: variables.url,
                },
              ]
            : undefined,
        nsfw: variables.nsfw,
        spoiler: variables.spoiler,
        title: variables.title,
        url: variables.type === 'link' ? variables.url : undefined,
        video:
          variables.type === 'video'
            ? {
                id: '',
                poster: {
                  id: '',
                  url: variables.posterUrl,
                },
                url: variables.url,
              }
            : undefined,
      })

      return {
        id: removePrefix(id),
      }
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
    types,
  }
}

type Translate = ReturnType<typeof useTranslations<'component.submission'>>

function generateSchema(t: Translate, submission: Submission) {
  const { body, flair, link, title } = submission.requirements

  const base = z.object({
    community: z.string(),
    flairId: flair ? z.string() : z.string().optional(),
    nsfw: z.boolean(),
    spoiler: z.boolean(),
    title: withContentRules(
      z
        .string()
        .min(
          title.min ?? 1,
          t('title.error.min', {
            min: title.min ?? 1,
          }),
        )
        .max(
          title.max ?? TITLE_MAX,
          t('title.error.max', {
            max: title.max ?? TITLE_MAX,
          }),
        ),
      title,
      {
        blacklist: t('title.error.blacklist', {
          list: title.blacklist.join(', '),
        }),
        pattern: t('title.error.pattern'),
        required: t('title.error.required', {
          list: title.required.join(', '),
        }),
      },
    ),
  })

  const text = withContentRules(
    body.policy === 'required'
      ? z.string().min(
          1,
          t('text.error.min', {
            min: 1,
          }),
        )
      : z.string(),
    body,
    {
      blacklist: t('text.error.blacklist', {
        list: body.blacklist.join(', '),
      }),
      pattern: t('text.error.pattern'),
      required: t('text.error.required', {
        list: body.required.join(', '),
      }),
    },
  )

  return z.discriminatedUnion('type', [
    z
      .object({
        text:
          body.policy === 'forbidden'
            ? z.string().max(0, t('text.error.forbidden')).optional()
            : body.policy === 'optional'
              ? text.optional()
              : text,
        type: z.literal('text'),
      })
      .extend(base.shape),
    z
      .object({
        type: z.literal('link'),
        url: z
          .url(t('link.error.url'))
          .refine(
            (value) =>
              link.whitelist.length === 0 ||
              link.whitelist.some((domain) => isOnDomain(value, domain)),
            t('link.error.whitelist', {
              list: link.whitelist.join(', '),
            }),
          )
          .refine(
            (value) =>
              !link.blacklist.some((domain) => isOnDomain(value, domain)),
            t('link.error.blacklist', {
              list: link.blacklist.join(', '),
            }),
          ),
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

// Reddit's own cap on a title
const TITLE_MAX = 300

const imageHostRegex = /reddit-uploaded-media.s3-accelerate.amazonaws.com/
const videoHostRegex = /reddit-uploaded-video.s3-accelerate.amazonaws.com/

// A community's word and pattern rules for a title or body. Like Reddit, the
// text needs at least one of the required words and must match one of the
// patterns, and words are matched case-insensitively.
function withContentRules(
  schema: z.ZodString,
  rules: SubmissionRequirements['title'],
  messages: Record<'blacklist' | 'pattern' | 'required', string>,
) {
  // patterns are written for Reddit's (Python) regex engine; one JavaScript
  // can't compile is skipped rather than blocking the post
  const patterns = rules.patterns.flatMap((pattern) => {
    try {
      return [new RegExp(pattern)]
    } catch {
      return []
    }
  })

  return schema
    .refine(
      (value) =>
        rules.required.length === 0 ||
        rules.required.some((word) => includes(value, word)),
      messages.required,
    )
    .refine(
      (value) => !rules.blacklist.some((word) => includes(value, word)),
      messages.blacklist,
    )
    .refine(
      (value) =>
        patterns.length === 0 ||
        patterns.some((pattern) => pattern.test(value)),
      messages.pattern,
    )
}

function includes(value: string, word: string) {
  return value.toLowerCase().includes(word.toLowerCase())
}

function isOnDomain(link: string, domain: string) {
  try {
    const { hostname } = new URL(link)

    return hostname === domain || hostname.endsWith(`.${domain}`)
  } catch {
    return false
  }
}
