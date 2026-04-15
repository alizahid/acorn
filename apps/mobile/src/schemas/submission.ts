import { z } from 'zod'

import { FlairSchema } from './flair'

export const SubmissionCommunitySchema = z.object({
  data: z.object({
    allow_galleries: z.boolean(),
    allow_images: z.boolean(),
    allow_videos: z.boolean(),
    community_icon: z.string().nullish(),
    display_name: z.string(),
    icon_img: z.string().nullish(),
    name: z.string(),
    spoilers_enabled: z.boolean(),
    submission_type: z.enum(['any', 'self', 'link']),
  }),
})

export type SubmissionCommunitySchema = z.infer<
  typeof SubmissionCommunitySchema
>

export const SubmissionFlairSchema = z.array(
  z.discriminatedUnion('type', [
    z.object({
      background_color: z.string(),
      id: z.string(),
      richtext: FlairSchema,
      text_color: z.enum(['light', 'dark']),
      type: z.literal('richtext'),
    }),
    z.object({
      background_color: z.string(),
      id: z.string(),
      text: z.string(),
      text_color: z.enum(['light', 'dark']),
      type: z.literal('text'),
    }),
  ]),
)

export type SubmissionFlairSchema = z.infer<typeof SubmissionFlairSchema>

export const SubmissionResponseSchema = z.object({
  json: z.union([
    z.object({
      data: z.union([
        z.object({
          id: z.string(),
        }),
        z.object({
          websocket_url: z.string(),
        }),
      ]),
    }),
    z.object({
      errors: z.array(z.tuple([z.string(), z.string(), z.string()])),
    }),
  ]),
})

export const SubmissionSocketSchema = z.object({
  payload: z.object({
    redirect: z.url(),
  }),
})
