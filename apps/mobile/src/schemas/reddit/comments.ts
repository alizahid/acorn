import { z } from 'zod'

import { PostMediaMetadataSchema } from './media'

export const CommentsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.union([
        z.object({
          after: z.string().nullish(),
          data: z.object({
            author: z.string(),
            body: z.string(),
            created: z.number(),
            depth: z.number().nullish(),
            id: z.string(),
            likes: z.boolean().nullable(),
            media_metadata: PostMediaMetadataSchema,
            parent_id: z.string(),
            saved: z.boolean(),
            ups: z.number(),
          }),
          kind: z.literal('t1'),
        }),
        z.object({
          kind: z.literal('more'),
        }),
      ]),
    ),
  }),
})

export type CommentsSchema = z.infer<typeof CommentsSchema>
