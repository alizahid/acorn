import { z } from 'zod'

export const UserSchema = z.object({
  created_utc: z.number().nullish(),
  icon_img: z.string().nullish(),
  id: z.string().nullish(),
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

export const UserDataSchema = z.record(
  z.string(),
  z.object({
    created_utc: z.number(),
    name: z.string(),
    profile_img: z.string(),
  }),
)

export type UserDataSchema = z.infer<typeof UserDataSchema>
