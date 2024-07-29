import { decode } from 'entities'

import { getImages, getMeta, getVideo } from '~/lib/media'
import { type PostsSchema } from '~/schemas/reddit/posts'
import { type Post, type PostType } from '~/types/post'

export function transformPost(
  data: PostsSchema['data']['children'][number],
): Post {
  let type: PostType = 'link'

  if (data.data.post_hint === 'image') {
    type = 'image'
  } else if (data.data.is_gallery) {
    type = 'gallery'
  } else if (data.data.is_video) {
    type = 'video'
  } else if (data.data.poll_data) {
    type = 'poll'
  } else if (data.data.crosspost_parent) {
    type = 'crosspost'
  } else if (data.data.is_self) {
    type = 'text'
  }

  const crossPost = data.data.crosspost_parent_list?.at(0)

  return {
    body: decode(data.data.selftext.trim()) || undefined,
    comments: data.data.num_comments,
    createdAt: new Date(data.data.created * 1_000),
    crossPost: crossPost
      ? transformPost({
          data: crossPost,
          kind: 't3',
        })
      : undefined,
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
    type,
    url: data.data.url ?? undefined,
    user: {
      id: data.data.author,
      name: data.data.author_fullname,
    },
    votes: data.data.ups,
  }
}
