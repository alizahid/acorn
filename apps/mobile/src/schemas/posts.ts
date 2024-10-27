import { z } from 'zod'

import { CommentDataSchema } from './comments'
import { CommunityDataSchema } from './communities'
import {
  PostGalleryDataSchema,
  PostMediaMetadataSchema,
  PostMediaSchema,
  PostPreviewSchema,
} from './media'

const PostBaseSchema = z.object({
  author: z.string(),
  author_fullname: z.string().catch('[deleted]'),
  created_utc: z.number(),
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
  sr_detail: CommunityDataSchema,
  stickied: z.boolean().nullish(),
  thumbnail: z.string().nullish(),
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

export const SavedPostsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.union([
        z.object({
          data: PostDataSchema,
          kind: z.literal('t3'),
        }),
        z.object({
          data: CommentDataSchema,
          kind: z.literal('t1'),
        }),
      ]),
    ),
  }),
})

export type SavedPostsSchema = z.infer<typeof SavedPostsSchema>
