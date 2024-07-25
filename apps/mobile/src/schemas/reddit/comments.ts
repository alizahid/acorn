import { z } from 'zod'

type Comments = {
  data: {
    after?: string | null
    children: Array<
      | {
          after?: string | null
          data: {
            author: string
            body: string
            created: number
            id: string
            likes: boolean | null
            replies: Comments
            saved: boolean
            ups: number
          }
          kind: 't1'
        }
      | {
          kind: 'more'
        }
    >
  }
}

export const CommentsSchema: z.ZodType<Comments> = z.object({
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
            id: z.string(),
            likes: z.boolean().nullable(),
            replies: z.lazy(
              () =>
                CommentsSchema.catch({
                  data: {
                    children: [],
                  },
                }) as z.ZodType<Comments>,
            ),
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
