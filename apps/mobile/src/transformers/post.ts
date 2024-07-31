import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { type PostDataSchema } from '~/schemas/reddit/posts'
import { type Post, type PostType } from '~/types/post'

export function transformPost(data: PostDataSchema): Post {
  let type: PostType = 'link'

  if (data.post_hint === 'image') {
    type = 'image'
  } else if (data.is_gallery) {
    type = 'gallery'
  } else if (data.is_video) {
    type = 'video'
  } else if (data.poll_data) {
    type = 'poll'
  } else if (data.crosspost_parent) {
    type = 'crosspost'
  } else if (data.is_self) {
    type = 'text'
  }

  const crossPost = data.crosspost_parent_list?.at(0)

  return {
    body: decode(data.selftext.trim()) || undefined,
    comments: data.num_comments,
    createdAt: new Date(data.created * 1_000),
    crossPost: crossPost ? transformPost(crossPost) : undefined,
    id: data.id,
    liked: data.likes,
    media: {
      images: getImages(data),
      meta: getMeta(data),
      video: getVideo(data.media),
    },
    nsfw: data.over_18,
    permalink: data.permalink,
    read: data.clicked,
    saved: data.saved,
    spoiler: data.spoiler,
    subreddit: data.subreddit,
    title: decode(data.title.trim()),
    type,
    url: data.url ?? undefined,
    user: {
      id: data.author,
      name: data.author_fullname,
    },
    votes: data.ups,
  }
}
