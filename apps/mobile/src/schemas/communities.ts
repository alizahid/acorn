import { z } from 'zod'

export const CommunityDataSchema = z.object({
  community_icon: z.string(),
  created: z.number(),
  display_name: z.string(),
  icon_img: z.string(),
  id: z.string(),
  subscribers: z.number(),
  user_is_subscriber: z.boolean(),
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
