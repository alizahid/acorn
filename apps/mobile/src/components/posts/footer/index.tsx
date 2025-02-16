import { useRouter } from 'expo-router'
import { useStyles } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  expanded?: boolean
  label?: PostLabel
  onLongPress?: () => void
  post: Post
}

export function PostFooter({ expanded, label, onLongPress, post }: Props) {
  const router = useRouter()

  const { theme } = useStyles()

  const { vote } = usePostVote()

  return (
    <Pressable
      align="center"
      delayed
      direction="row"
      disabled={expanded}
      gap="4"
      justify="between"
      onLongPress={onLongPress}
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
      <View gap="2">
        <PostCommunity label={label} post={post} />

        <PostMeta post={post} />
      </View>

      <View align="center" direction="row" gap="2">
        {expanded && onLongPress ? (
          <FooterButton
            color={theme.colors.gray.text}
            icon="DotsThree"
            onPress={() => {
              onLongPress()
            }}
            weight="bold"
          />
        ) : null}

        <FooterButton
          color={
            post.liked ? theme.colors.orange.accent : theme.colors.gray.text
          }
          fill={post.liked === true}
          icon="ArrowUp"
          onPress={() => {
            vote({
              direction: post.liked ? 0 : 1,
              postId: post.id,
            })
          }}
          weight="bold"
        />

        <FooterButton
          color={
            post.liked === false
              ? theme.colors.violet.accent
              : theme.colors.gray.text
          }
          fill={post.liked === false}
          icon="ArrowDown"
          onPress={() => {
            vote({
              direction: post.liked === false ? 0 : -1,
              postId: post.id,
            })
          }}
          weight="bold"
        />
      </View>
    </Pressable>
  )
}
