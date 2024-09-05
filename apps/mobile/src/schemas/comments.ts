import { z } from 'zod'

import { PostMediaMetadataSchema } from './media'

export const CommentDataSchema = z.object({
  author: z.string(),
  body: z.string(),
  created: z.number(),
  depth: z.number().nullish(),
  id: z.string(),
  is_submitter: z.boolean(),
  likes: z.boolean().nullable(),
  link_id: z.string(),
  media_metadata: PostMediaMetadataSchema,
  parent_id: z.string(),
  saved: z.boolean(),
  stickied: z.boolean().nullish(),
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
      z.union([
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
        z.union([
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
