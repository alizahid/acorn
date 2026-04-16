import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { getIcon } from '~/lib/icons'
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

  const { hidePostActions } = usePreferences(['hidePostActions'])

  const { vote } = usePostVote()

  return (
    <View style={[styles.main(community), style]}>
      <View style={styles.header}>
        {community ? <PostCommunity post={post} /> : null}

        <PostMeta post={post} />
      </View>

      {hidePostActions ? null : (
        <View style={styles.footer}>
          <FooterButton
            color={post.liked === true ? 'orange' : undefined}
            fill={post.liked === true}
            icon={getIcon('upvote.fill')}
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
            icon={getIcon('downvote.fill')}
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

const styles = StyleSheet.create((theme) => ({
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  header: {
    flexShrink: 1,
    gap: theme.space[2],
  },
  main: (community: boolean) => ({
    alignItems: community ? 'center' : 'flex-end',
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
    margin: -theme.space[3],
    padding: theme.space[3],
  }),
}))
