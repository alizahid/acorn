import { fromUnixTime } from 'date-fns'
import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { type PostDataSchema } from '~/schemas/posts'
import { type Post, type PostType } from '~/types/post'

export function transformPost(data: PostDataSchema): Post {
  const crossPost = data.crosspost_parent_list?.at(0)

  return {
    body: decode(data.selftext.trim()) || undefined,
    comments: data.num_comments,
    createdAt: fromUnixTime(data.created),
    crossPost: crossPost ? transformPost(crossPost) : undefined,
    id: data.id,
    liked: data.likes,
    media: {
      images: getImages(data),
      meta: getMeta(data),
      video: getVideo(data),
    },
    nsfw: data.over_18,
    permalink: data.permalink,
    read: data.clicked,
    saved: data.saved,
    spoiler: data.spoiler,
    subreddit: data.subreddit.startsWith('u_')
      ? `u/${data.subreddit.slice(2)}`
      : data.subreddit,
    title: decode(data.title.trim()),
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
  if (data.post_hint === 'image') {
    return 'image'
  }

  if (data.is_gallery) {
    return 'gallery'
  }

  if (Boolean(data.is_video) || data.post_hint === 'rich:video') {
    return 'video'
  }

  if (data.poll_data) {
    return 'poll'
  }

  if (data.crosspost_parent) {
    return 'crosspost'
  }

  if (data.is_self) {
    return 'text'
  }

  return 'link'
}
