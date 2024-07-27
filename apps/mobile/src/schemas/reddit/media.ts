import { z } from 'zod'

export const MediaMetadataSchema = z
  .record(
    z.string(),
    z.union([
      z.object({
        id: z.string(),
        s: z.object({
          u: z.string(),
          x: z.number(),
          y: z.number(),
        }),
      }),
      z.object({
        id: z.string(),
        s: z.object({
          gif: z.string(),
          x: z.number(),
          y: z.number(),
        }),
      }),
      z.object({
        hlsUrl: z.string(),
        id: z.string(),
        x: z.number(),
        y: z.number(),
      }),
    ]),
  )
  .nullish()
