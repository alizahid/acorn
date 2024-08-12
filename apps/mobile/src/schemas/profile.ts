import { z } from 'zod'

export const ProfileSchema = z.object({
  data: z.object({
    comment_karma: z.number(),
    created: z.number(),
    icon_img: z.string(),
    id: z.string(),
    link_karma: z.number(),
    name: z.string(),
    subreddit: z.object({
      name: z.string(),
      user_is_subscriber: z.boolean(),
    }),
    total_karma: z.number(),
  }),
})

export type ProfileSchema = z.infer<typeof ProfileSchema>
