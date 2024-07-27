import { z } from 'zod'

export const PostsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.object({
        data: z.object({
          author: z.string(),
          author_fullname: z.string().catch('[deleted]'),
          clicked: z.boolean(),
          created: z.number(),
          gallery_data: z
            .object({
              items: z.array(
                z.object({
                  media_id: z.string(),
                }),
              ),
            })
            .nullish(),
          id: z.string(),
          likes: z.boolean().nullable(),
          media: z
            .union([
              z.object({
                reddit_video: z.object({
                  height: z.number(),
                  hls_url: z.string(),
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
          media_metadata: z
            .record(
              z.string(),
              z.union([
                z.object({
                  id: z.string(),
                  s: z.object({
                    u: z.string(),
                    x: z.number(),
                    y: z.number(),
                  }),
                }),
                z.object({
                  id: z.string(),
                  s: z.object({
                    mp4: z.string(),
                    x: z.number(),
                    y: z.number(),
                  }),
                }),
                z.object({
                  hlsUrl: z.string(),
                  id: z.string(),
                  x: z.number(),
                  y: z.number(),
                }),
              ]),
            )
            .nullish(),
          num_comments: z.number(),
          over_18: z.boolean(),
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
          subreddit: z.string(),
          title: z.string(),
          ups: z.number(),
          url: z.string().nullish(),
        }),
        kind: z.literal('t3'),
      }),
    ),
  }),
})

export type PostsSchema = z.infer<typeof PostsSchema>
