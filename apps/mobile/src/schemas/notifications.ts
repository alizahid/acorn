import { z } from 'zod'

export const NotificationsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.discriminatedUnion('kind', [
        z.object({
          data: z.object({
            author: z.string(),
            body_html: z.string(),
            context: z.string(),
            created_utc: z.number(),
            id: z.string(),
            new: z.boolean(),
            subreddit: z.string(),
            type: z.enum(['comment_reply', 'post_reply', 'username_mention']),
          }),
          kind: z.literal('t1'),
        }),
        z.object({
          kind: z.literal('t4'),
        }),
      ]),
    ),
  }),
})

export type NotificationsSchema = z.infer<typeof NotificationsSchema>
