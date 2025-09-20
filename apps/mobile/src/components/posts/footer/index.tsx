import { type StyleProp, type ViewStyle } from 'react-native'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

type Props = {
  community?: boolean
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostFooter({ community = true, post, style }: Props) {
  const a11y = useTranslations('a11y')

  const { hidePostActions } = usePreferences()

  const { vote } = usePostVote()

  return (
    <View
      align={community ? 'center' : 'end'}
      direction="row"
      gap="4"
      justify="between"
      m="-3"
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
            color={post.liked === true ? 'orange' : undefined}
            fill={post.liked === true}
            icon="arrowshape.up.fill"
            label={a11y(post.liked ? 'removeUpvote' : 'upvote')}
            onPress={() => {
              vote({
                direction: post.liked ? 0 : 1,
                postId: post.id,
              })
            }}
          />

          <FooterButton
            color={post.liked === false ? 'violet' : undefined}
            fill={post.liked === false}
            icon="arrowshape.down.fill"
            label={a11y(post.liked === false ? 'removeDownvote' : 'downvote')}
            onPress={() => {
              vote({
                direction: post.liked === false ? 0 : -1,
                postId: post.id,
              })
            }}
          />
        </View>
      )}
    </View>
  )
}
