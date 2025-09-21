import { z } from 'zod'

export const InboxSchema = z.object({
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
          data: z.object({
            author: z.string().nullable(),
            body_html: z.string(),
            created_utc: z.number(),
            id: z.string(),
            new: z.boolean(),
            subject: z.string(),
          }),
          kind: z.literal('t4'),
        }),
      ]),
    ),
  }),
})

export type InboxSchema = z.infer<typeof InboxSchema>
