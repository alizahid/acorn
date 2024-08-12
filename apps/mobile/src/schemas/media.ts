import { z } from 'zod'

export const PostMediaMetadataSchema = z
  .record(
    z.string(),
    z.union([
      z.object({
        id: z.string(),
        p: z.array(
          z.object({
            u: z.string(),
            x: z.number(),
            y: z.number(),
          }),
        ),
        s: z.object({
          u: z.string(),
          x: z.number(),
          y: z.number(),
        }),
        status: z.literal('valid'),
      }),
      z.object({
        id: z.string(),
        s: z.object({
          gif: z.string(),
          x: z.number(),
          y: z.number(),
        }),
        status: z.literal('valid'),
      }),
      z.object({
        hlsUrl: z.string(),
        id: z.string(),
        status: z.literal('valid'),
        x: z.number(),
        y: z.number(),
      }),
      z.object({
        status: z.literal('failed'),
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
      type: z.string(),
    }),
    z.object({
      oembed: z.object({
        html: z.string(),
        type: z.literal('rich'),
      }),
      type: z.string(),
    }),
  ])
  .nullish()

export type PostMediaSchema = z.infer<typeof PostMediaSchema>

export const PostPreviewImageSchema = z.object({
  resolutions: z.array(
    z.object({
      height: z.number(),
      url: z.string(),
      width: z.number(),
    }),
  ),
  source: z.object({
    height: z.number(),
    url: z.string(),
    width: z.number(),
  }),
})

export type PostPreviewImageSchema = z.infer<typeof PostPreviewImageSchema>

export const PostPreviewSchema = z
  .object({
    images: z.array(
      PostPreviewImageSchema.extend({
        variants: z
          .object({
            gif: PostPreviewImageSchema.nullish(),
          })
          .nullish(),
      }),
    ),
    reddit_video_preview: z
      .object({
        height: z.number(),
        hls_url: z.string(),
        width: z.number(),
      })
      .nullish(),
  })
  .nullish()

export type PostPreviewSchema = z.infer<typeof PostPreviewSchema>
