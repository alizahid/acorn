import { z } from 'zod'

import { CommentsSchema } from './comments'
import { PostsSchema } from './posts'

export const PostSchema = z.tuple([PostsSchema, CommentsSchema])

export type PostSchema = z.infer<typeof PostSchema>
