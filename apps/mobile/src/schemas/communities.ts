import { z } from 'zod'

export const CommunityDataSchema = z.object({
  banner_background_image: z.string().nullish(),
  community_icon: z.string().nullish(),
  created_utc: z.number().nullish(),
  display_name: z.string(),
  icon_img: z.string().nullish(),
  mobile_banner_image: z.string().nullish(),
  name: z.string(),
  public_description: z.string().nullish(),
  subreddit_type: z.string(),
  subscribers: z.number().nullish(),
  title: z.string().nullish(),
  user_has_favorited: z.boolean().nullish(),
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
