import { z } from 'zod'

import { FlairSchema } from './flair'
import { PostMediaMetadataSchema } from './media'

export const CommentDataSchema = z.object({
  author: z.string(),
  author_flair_richtext: FlairSchema.nullish(),
  author_fullname: z.string().optional(),
  body: z.string(),
  created_utc: z.number(),
  depth: z.number().nullish(),
  edited: z.union([z.boolean(), z.number()]).optional(),
  id: z.string(),
  is_submitter: z.boolean(),
  likes: z.boolean().nullable(),
  link_author: z.string().optional(),
  link_id: z.string(),
  link_permalink: z.string().optional(),
  link_title: z.string().optional(),
  media_metadata: PostMediaMetadataSchema,
  parent_id: z.string(),
  permalink: z.string(),
  saved: z.boolean(),
  stickied: z.boolean(),
  subreddit: z.string(),
  subreddit_id: z.string(),
  ups: z.number(),
})

export type CommentDataSchema = z.infer<typeof CommentDataSchema>

export const CommentMoreSchema = z.object({
  children: z.array(z.string()),
  count: z.number(),
  depth: z.number(),
  id: z.string(),
  parent_id: z.string(),
})

export type CommentMoreSchema = z.infer<typeof CommentMoreSchema>

export const CommentsSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.discriminatedUnion('kind', [
        z.object({
          data: CommentDataSchema,
          kind: z.literal('t1'),
        }),
        z.object({
          data: CommentMoreSchema,
          kind: z.literal('more'),
        }),
      ]),
    ),
  }),
})

export type CommentsSchema = z.infer<typeof CommentsSchema>

export const MoreCommentsSchema = z.object({
  json: z.object({
    data: z.object({
      things: z.array(
        z.discriminatedUnion('kind', [
          z.object({
            data: CommentDataSchema,
            kind: z.literal('t1'),
          }),
          z.object({
            data: CommentMoreSchema,
            kind: z.literal('more'),
          }),
        ]),
      ),
    }),
  }),
})

export type MoreCommentsSchema = z.infer<typeof MoreCommentsSchema>

export const CreateCommentSchema = z.object({
  json: z.object({
    data: z.object({
      things: z.array(
        z.object({
          data: CommentDataSchema,
          kind: z.literal('t1'),
        }),
      ),
    }),
  }),
})

export type CreateCommentSchema = z.infer<typeof CreateCommentSchema>
