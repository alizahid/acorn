import { z } from 'zod'

export const PostMediaMetadataSchema = z
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

export type PostMediaMetadataSchema = z.infer<typeof PostMediaMetadataSchema>

export const PostGalleryDataSchema = z
  .object({
    items: z.array(
      z.object({
        media_id: z.string(),
      }),
    ),
  })
  .nullish()

export type PostGalleryDataSchema = z.infer<typeof PostGalleryDataSchema>

export const PostMediaSchema = z
  .union([
    z.object({
      reddit_video: z.object({
        height: z.number(),
        hls_url: z.string(),
        width: z.number(),
      }),
    }),
    z.object({
      oembed: z.object({
        height: z.number(),
        html: z.string(),
        type: z.literal('video'),
        width: z.number(),
      }),
    }),
    z.object({
      oembed: z.object({
        html: z.string(),
        type: z.literal('rich'),
      }),
    }),
  ])
  .nullish()

export type PostMediaSchema = z.infer<typeof PostMediaSchema>

export const PostPreviewSchema = z
  .object({
    images: z.array(
      z.object({
        source: z.object({
          height: z.number(),
          url: z.string(),
          width: z.number(),
        }),
      }),
    ),
  })
  .nullish()

export type PostPreviewSchema = z.infer<typeof PostPreviewSchema>
