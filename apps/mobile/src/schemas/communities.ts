import { z } from 'zod'

export const CommunityDataSchema = z.object({
  community_icon: z.string().nullish(),
  created: z.number(),
  display_name: z.string(),
  icon_img: z.string().nullish(),
  id: z.string(),
  subreddit_type: z.string().nullish(),
  subscribers: z.number().nullish(),
  user_is_subscriber: z.boolean().nullish(),
})

export type CommunityDataSchema = z.infer<typeof CommunityDataSchema>

export const CommunitiesSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.object({
        data: CommunityDataSchema,
        kind: z.literal('t5'),
      }),
    ),
  }),
})

export type CommunitiesSchema = z.infer<typeof CommunitiesSchema>

export const CommunitySchema = z.object({
  data: CommunityDataSchema,
  kind: z.literal('t5'),
})

export type CommunitySchema = z.infer<typeof CommunitySchema>
