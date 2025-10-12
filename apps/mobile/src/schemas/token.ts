import { z } from 'zod'

export const TokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
})

export type TokenSchema = z.infer<typeof TokenSchema>
