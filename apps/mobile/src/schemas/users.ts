import { z } from 'zod'

export const UserSchema = z.object({
  created_utc: z.number().optional(),
  icon_img: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
})

export type UserSchema = z.infer<typeof UserSchema>

export const UsersSchema = z.object({
  data: z.object({
    after: z.string().nullish(),
    children: z.array(
      z.object({
        data: UserSchema,
        kind: z.literal('t2'),
      }),
    ),
  }),
})

export type UsersSchema = z.infer<typeof UsersSchema>
