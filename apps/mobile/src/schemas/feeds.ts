import { z } from 'zod'

export const FeedDataSchema = z.object({
  created_utc: z.number(),
  display_name: z.string(),
  icon_url: z.string().nullish(),
  name: z.string(),
  subreddits: z.array(
    z.object({
      name: z.string(),
    }),
  ),
})

export type FeedDataSchema = z.infer<typeof FeedDataSchema>

export const FeedsSchema = z.array(
  z.object({
    data: FeedDataSchema,
    kind: z.literal('LabeledMulti'),
  }),
)

export type FeedsSchema = z.infer<typeof FeedsSchema>

// [
//   {
//     "kind": "LabeledMulti",
//     "data": {
//       "can_edit": true,
//       "description_html": "",
//       "num_subscribers": 0,
//       "copied_from": null,
//       "visibility": "public",
//       "created": 1731077644.0,
//       "over_18": false,
//       "path": "/user/mildpanda/m/js/",
//       "owner": "mildpanda",
//       "key_color": null,
//       "is_subscriber": false,
//       "owner_id": "t2_okkk9",
//       "description_md": "",
//       "is_favorited": false
//     }
//   }
// ]
