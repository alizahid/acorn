import { type Post } from '@acorn/reddit'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { usePreferences } from '~/stores/preferences'

import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

type Props = {
  community?: boolean
  hideCommunity?: boolean
  hideUser?: boolean
  post: Post
  privacy?: boolean
  style?: StyleProp<ViewStyle>
}

export function PostFooter({
  community = true,
  hideCommunity,
  hideUser,
  post,
  privacy,
  style,
}: Props) {
  const a11y = useTranslations('a11y')

  const { hidePostActions } = usePreferences(
    useShallow((state) => ({
      hidePostActions: state.hidePostActions,
    })),
  )

  const { vote } = usePostVote()

  return (
    <View style={[styles.main(community), style]}>
      <View style={styles.header}>
        {community ? (
          <PostCommunity
            hideCommunity={hideCommunity}
            hideUser={hideUser}
            post={post}
          />
        ) : null}

        <PostMeta post={post} privacy={privacy} />
      </View>

      {hidePostActions ? null : (
        <View style={styles.footer}>
          <FooterButton
            color={!privacy && post.liked === true ? 'orange' : undefined}
            fill={!privacy && post.liked === true}
            icon="arrow-fat-up-fill"
            label={a11y(post.liked ? 'removeUpvote' : 'upvote')}
            onPress={() => {
              vote({
                action: post.liked ? 'unvote' : 'upvote',
                postId: post.id,
              })
            }}
          />

          <FooterButton
            color={!privacy && post.liked === false ? 'violet' : undefined}
            fill={!privacy && post.liked === false}
            icon="arrow-fat-down-fill"
            label={a11y(post.liked === false ? 'removeDownvote' : 'downvote')}
            onPress={() => {
              vote({
                action: post.liked === false ? 'unvote' : 'downvote',
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
    alignItems: community ? 'center' : 'flex-start',
    flexDirection: 'row',
    gap: theme.space[4],
    justifyContent: 'space-between',
  }),
}))
