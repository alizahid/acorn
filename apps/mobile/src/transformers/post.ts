import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { removePrefix } from '~/lib/reddit'
import { type PostDataSchema } from '~/schemas/posts'
import { type UserDataSchema } from '~/schemas/users'
import { type Post, type PostType } from '~/types/post'

import { transformCommunity } from './community'
import { transformFlair } from './flair'

export function transformPost(
  data: PostDataSchema,
  extra?: {
    seen?: Array<string>
    users?: UserDataSchema
  },
): Post {
  const crossPost = data.crosspost_parent_list?.[0]

  const id = removePrefix(data.id)

  const user = data.author_fullname
    ? extra?.users?.[data.author_fullname]
    : undefined

  return {
    body: decode(data.selftext) || undefined,
    comments: data.num_comments,
    community: transformCommunity(data.sr_detail),
    createdAt: fromUnixTime(data.created_utc),
    crossPost: crossPost ? transformPost(crossPost, extra) : undefined,
    flair: transformFlair(data.link_flair_richtext),
    hidden: Boolean(data.hidden),
    id,
    liked: data.likes,
    media: {
      images: getImages(data),
      meta: getMeta(data),
      video: getVideo(data),
    },
    nsfw: data.over_18,
    permalink: data.permalink,
    ratio: data.upvote_ratio,
    saved: data.saved,
    seen: extra?.seen?.includes(id) ?? false,
    spoiler: data.spoiler,
    sticky: Boolean(data.stickied),
    title: decode(data.title),
    type: getType(data),
    url: data.url ?? undefined,
    user: {
      createdAt: user ? fromUnixTime(user.created_utc) : undefined,
      id: data.author_fullname,
      image: user?.profile_img ? decode(user.profile_img) : undefined,
      name: data.author,
    },
    votes: data.ups,
  }
}

function getType(data: PostDataSchema): PostType {
  if (data.crosspost_parent_list?.[0]) {
    return 'crosspost'
  }

  if (data.is_self) {
    return 'text'
  }

  if (
    Boolean(data.is_video) ||
    data.post_hint === 'rich:video' ||
    (data.media &&
      'oembed' in data.media &&
      'type' in data.media.oembed &&
      data.media.oembed.type === 'video')
  ) {
    return 'video'
  }

  if (data.post_hint === 'image' || data.is_gallery) {
    return 'image'
  }

  if (data.poll_data) {
    return 'poll'
  }

  return 'link'
}
