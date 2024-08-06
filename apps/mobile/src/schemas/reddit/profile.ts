import { z } from 'zod'

export const ProfileSchema = z.object({
  data: z.object({
    comment_karma: z.number(),
    created: z.number(),
    icon_img: z.string(),
    id: z.string(),
    link_karma: z.number(),
    name: z.string(),
    total_karma: z.number(),
  }),
})

export type ProfileSchema = z.infer<typeof ProfileSchema>
