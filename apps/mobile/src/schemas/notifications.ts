import { z } from 'zod'

export const NotificationsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.union([
        z.object({
          data: z.object({
            author: z.string(),
            context: z.string(),
            created: z.number(),
            id: z.string(),
            new: z.boolean(),
            subreddit: z.string(),
            type: z.enum(['comment_reply', 'post_reply']),
          }),
          kind: z.literal('t1'),
        }),
        z.object({
          kind: z.enum(['t2', 't3', 't4', 't5', 't6']),
        }),
      ]),
    ),
  }),
})

export type NotificationsSchema = z.infer<typeof NotificationsSchema>
