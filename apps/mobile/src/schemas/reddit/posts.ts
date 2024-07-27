import { z } from 'zod'

import {
  PostGalleryDataSchema,
  PostMediaMetadataSchema,
  PostMediaSchema,
  PostPreviewSchema,
} from './media'

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
          gallery_data: PostGalleryDataSchema,
          id: z.string(),
          likes: z.boolean().nullable(),
          media: PostMediaSchema,
          media_metadata: PostMediaMetadataSchema,
          num_comments: z.number(),
          over_18: z.boolean(),
          permalink: z.string(),
          preview: PostPreviewSchema,
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
