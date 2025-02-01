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

export const SubmissionRequirementsSchema = z.object({
  body_blacklisted_strings: z.array(z.string()),
  body_required_strings: z.array(z.string()),
  body_text_max_length: z.number().nullish(),
  body_text_min_length: z.number().nullish(),
  domain_blacklist: z.array(z.string()),
  domain_whitelist: z.array(z.string()),
  gallery_max_items: z.number().nullish(),
  gallery_min_items: z.number().nullish(),
  is_flair_required: z.boolean(),
  title_blacklisted_strings: z.array(z.string()),
  title_required_strings: z.array(z.string()),
  title_text_max_length: z.number().nullish(),
  title_text_min_length: z.number().nullish(),
})

export type SubmissionRequirementsSchema = z.infer<
  typeof SubmissionRequirementsSchema
>

export const SubmissionResponseSchema = z.object({
  json: z.object({
    data: z.union([
      z.object({
        id: z.string(),
      }),
      z.object({
        websocket_url: z.string(),
      }),
    ]),
  }),
})

export const SubmissionSocketSchema = z.object({
  payload: z.object({
    redirect: z.string().url(),
  }),
})
