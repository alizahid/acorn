import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { type PostsSchema } from '~/schemas/reddit/posts'
import { type Post } from '~/types/post'

export function transformPost(
  data: PostsSchema['data']['children'][number]['data'],
): Post {
  return {
    body: decode(data.selftext.trim()) || undefined,
    comments: data.num_comments,
    createdAt: new Date(data.created * 1_000),
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
    user: {
      id: data.author,
      name: data.author_fullname,
    },
    votes: data.ups,
  }
}
