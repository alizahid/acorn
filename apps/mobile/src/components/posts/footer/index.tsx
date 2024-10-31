import { useRouter } from 'expo-router'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { PostSaveCard } from '../save'
import { PostShareCard } from '../share'
import { PostVoteCard } from '../vote'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  seen?: boolean
}

export function PostFooterCard({ expanded, label, post, seen }: Props) {
  const router = useRouter()

  return (
    <Pressable
      direction="row"
      disabled={expanded}
      gap="4"
      justify="between"
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      p="3"
    >
      <View align="start" flexShrink={1} gap="3">
        <PostCommunity label={label} post={post} seen={seen} />

        <PostMeta post={post} seen={seen} />
      </View>

      <View align="center" direction="row" gap="3">
        <PostVoteCard expanded={expanded} post={post} seen={seen} />

        <PostSaveCard post={post} seen={seen} />

        {!expanded ? <PostShareCard post={post} seen={seen} /> : null}
      </View>
    </Pressable>
  )
}
