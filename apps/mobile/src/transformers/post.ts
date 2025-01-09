import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { removePrefix } from '~/lib/reddit'
import { type PostDataSchema } from '~/schemas/posts'
import { type Post, type PostType } from '~/types/post'

import { transformCommunity } from './community'
import { transformFlair } from './flair'

export function transformPost(data: PostDataSchema, seen: Array<string>): Post {
  const crossPost = data.crosspost_parent_list?.[0]

  const id = removePrefix(data.id)

  return {
    body: decode(data.selftext).trim() || undefined,
    comments: data.num_comments,
    community: transformCommunity(data.sr_detail),
    createdAt: fromUnixTime(data.created_utc),
    crossPost: crossPost ? transformPost(crossPost, seen) : undefined,
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
    saved: data.saved,
    seen: seen.includes(id),
    spoiler: data.spoiler,
    sticky: Boolean(data.stickied),
    title: decode(data.title).trim(),
    type: getType(data),
    url: data.url ?? undefined,
    user: {
      id: data.author_fullname,
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
