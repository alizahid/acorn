import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

type Props = {
  community?: boolean
  expanded?: boolean
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostFooter({ community = true, expanded, post, style }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const { hidePostActions } = usePreferences()

  const { theme } = useStyles()

  const { vote } = usePostVote()

  return (
    <Pressable
      align={community ? 'center' : 'end'}
      direction="row"
      disabled={expanded}
      gap="4"
      hint={a11y('viewPost')}
      justify="between"
      label={post.title}
      onPress={() => {
        router.push({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      p="3"
      style={style}
    >
      <View flexShrink={1} gap="2">
        {community ? <PostCommunity post={post} /> : null}

        <PostMeta post={post} />
      </View>

      {hidePostActions ? null : (
        <View align="center" direction="row" gap="2">
          <FooterButton
            color={
              post.liked ? theme.colors.orange.accent : theme.colors.gray.text
            }
            fill={post.liked === true}
            icon="ArrowUp"
            label={a11y(post.liked ? 'removeUpvote' : 'upvote')}
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
            label={a11y(post.liked === false ? 'removeDownvote' : 'downvote')}
            onPress={() => {
              vote({
                direction: post.liked === false ? 0 : -1,
                postId: post.id,
              })
            }}
            weight="bold"
          />
        </View>
      )}
    </Pressable>
  )
}
