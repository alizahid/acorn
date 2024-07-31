import { z } from 'zod'

import {
  PostGalleryDataSchema,
  PostMediaMetadataSchema,
  PostMediaSchema,
  PostPreviewSchema,
} from './media'

const PostBaseSchema = z.object({
  author: z.string(),
  author_fullname: z.string().catch('[deleted]'),
  clicked: z.boolean(),
  created: z.number(),
  gallery_data: PostGalleryDataSchema,
  id: z.string(),
  is_gallery: z.boolean().nullish(),
  is_self: z.boolean().nullish(),
  is_video: z.boolean().nullish(),
  likes: z.boolean().nullable(),
  media: PostMediaSchema,
  media_metadata: PostMediaMetadataSchema,
  num_comments: z.number(),
  over_18: z.boolean(),
  permalink: z.string(),
  poll_data: z.object({}).nullish(),
  post_hint: z.string().nullish(),
  preview: PostPreviewSchema,
  saved: z.boolean(),
  selftext: z.string(),
  spoiler: z.boolean(),
  subreddit: z.string(),
  title: z.string(),
  ups: z.number(),
  url: z.string().nullish(),
})

export const PostDataSchema = PostBaseSchema.extend({
  crosspost_parent: z.string().nullish(),
  crosspost_parent_list: z.array(PostBaseSchema).nullish(),
})

export type PostDataSchema = z.infer<typeof PostDataSchema>

export const PostsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.object({
        data: PostDataSchema,
        kind: z.literal('t3'),
      }),
    ),
  }),
})

export type PostsSchema = z.infer<typeof PostsSchema>
