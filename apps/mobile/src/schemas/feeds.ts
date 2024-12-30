import { z } from 'zod'

export const FeedDataSchema = z.object({
  created_utc: z.number(),
  display_name: z.string(),
  icon_url: z.string().nullish(),
  name: z.string(),
  subreddits: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

export type FeedDataSchema = z.infer<typeof FeedDataSchema>

export const FeedsSchema = z.array(
  z.object({
    data: FeedDataSchema,
    kind: z.literal('LabeledMulti'),
  }),
)

export type FeedsSchema = z.infer<typeof FeedsSchema>
