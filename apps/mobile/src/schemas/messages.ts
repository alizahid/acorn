import { z } from 'zod'

const MessageBaseSchema = z.object({
  author: z.string().nullable(),
  body_html: z.string(),
  created_utc: z.number(),
  dest: z.string(),
  id: z.string(),
  new: z.boolean(),
  subject: z.string(),
})

const MessageSchema = MessageBaseSchema.extend({
  replies: z
    .union([
      z.literal(''),
      z.object({
        data: z.object({
          children: z.array(
            z.object({
              data: MessageBaseSchema,
            }),
          ),
        }),
      }),
    ])
    .optional(),
})

export type Message = z.infer<typeof MessageSchema>

export const MessagesSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: MessageSchema,
      }),
    ),
  }),
})

export type MessagesSchema = z.infer<typeof MessagesSchema>
