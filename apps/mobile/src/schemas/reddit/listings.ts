import { z } from 'zod'

export const ListingsSchema = z.object({
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    children: z.array(
      z.object({
        data: z.object({
          author: z.string(),
          author_fullname: z.string(),
          clicked: z.boolean(),
          created: z.number(),
          id: z.string(),
          media: z
            .union([
              z.object({
                reddit_video: z.object({
                  fallback_url: z.string(),
                  height: z.number(),
                  width: z.number(),
                }),
              }),
              z.object({
                oembed: z.object({
                  height: z.number(),
                  html: z.string(),
                  width: z.number(),
                }),
              }),
            ])
            .nullish(),
          num_comments: z.number(),
          permalink: z.string(),
          preview: z
            .object({
              images: z.array(
                z.object({
                  source: z.object({
                    height: z.number(),
                    url: z.string(),
                    width: z.number(),
                  }),
                }),
              ),
            })
            .nullish(),
          saved: z.boolean(),
          selftext: z.string(),
          spoiler: z.boolean(),
          title: z.string(),
          ups: z.number(),
          url: z.string().nullish(),
        }),
        kind: z.literal('t3'),
      }),
    ),
  }),
})

export type ListingsSchema = z.infer<typeof ListingsSchema>
