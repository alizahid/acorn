import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { type PostsSchema } from '~/schemas/reddit/posts'
import { type Post } from '~/types/post'

export function transformPost(
  data: PostsSchema['data']['children'][number],
): Post {
  return {
    body: decode(data.data.selftext.trim()) || undefined,
    comments: data.data.num_comments,
    createdAt: new Date(data.data.created * 1_000),
    id: data.data.id,
    liked: data.data.likes,
    media: {
      images: getImages(data.data),
      meta: getMeta(data),
      video: getVideo(data.data.media),
    },
    nsfw: data.data.over_18,
    permalink: data.data.permalink,
    read: data.data.clicked,
    saved: data.data.saved,
    spoiler: data.data.spoiler,
    subreddit: data.data.subreddit,
    title: decode(data.data.title.trim()),
    url: data.data.url ?? undefined,
    user: {
      id: data.data.author,
      name: data.data.author_fullname,
    },
    votes: data.data.ups,
  }
}
