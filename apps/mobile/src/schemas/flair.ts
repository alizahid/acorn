import { z } from 'zod'

export const FlairSchema = z.array(
  z.union([
    z.object({
      e: z.literal('text'),
      t: z.string(),
    }),
    z.object({
      e: z.literal('emoji'),
      u: z.string(),
    }),
  ]),
)

export type FlairSchema = z.infer<typeof FlairSchema>
