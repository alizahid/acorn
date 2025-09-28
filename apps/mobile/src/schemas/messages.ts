import { z } from 'zod'

const MessageSchema = z.object({
  data: z.object({
    author: z.string(),
    body_html: z.string(),
    created_utc: z.number(),
    dest: z.string(),
    id: z.string(),
    new: z.boolean(),
    get replies() {
      return z.union([
        z.literal(''),
        z.object({
          data: z.object({
            after: z.string().nullish(),
            children: z.array(MessageSchema),
          }),
        }),
      ])
    },
  }),
  kind: z.literal('t4'),
})

export const MessagesSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(MessageSchema),
  }),
})

export type MessagesSchema = z.infer<typeof MessagesSchema>
