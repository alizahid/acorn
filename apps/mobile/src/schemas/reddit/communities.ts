import { z } from 'zod'

export const CommunitiesSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.object({
        data: z.object({
          display_name: z.string(),
          icon_img: z.string(),
          id: z.string(),
        }),
        kind: z.literal('t5'),
      }),
    ),
  }),
})

export type CommunitiesSchema = z.infer<typeof CommunitiesSchema>
