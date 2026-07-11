import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { useCommentVote } from '~/hooks/mutations/comments/vote'
import { removePrefix } from '~/lib/reddit'
import { space } from '~/styles/tokens'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { TimeAgo } from '../common/time'
import { FlairCard, type FlairType } from '../posts/flair'
import { FooterButton } from '../posts/footer/button'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  flair?: FlairType
  privacy?: boolean
  top?: boolean
}

export function CommentMeta({
  collapsed,
  comment,
  flair,
  privacy,
  top,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  const { vote } = useCommentVote()

  return (
    <View style={styles.main(top || collapsed, !top || collapsed)}>
      {comment.sticky ? (
        <Icon
          name="push-pin"
          style={styles.sticky}
          uniProps={(theme) => ({
            color: theme.colors.red.accent,
            size: theme.typography[1].lineHeight,
          })}
        />
      ) : null}

      <Pressable
        accessibilityHint={a11y('viewUser')}
        accessibilityLabel={comment.user.name}
        hitSlop={space[3]}
        onPress={() => {
          router.navigate({
            params: {
              name: removePrefix(comment.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
        style={styles.user}
      >
        {/* {comment.user.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={comment.user.image}
            style={styles.image}
          />
        ) : null} */}

        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={!comment.op}
          numberOfLines={1}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        {comment.edited ? (
          <Icon
            name="pencil"
            uniProps={(theme) => ({
              color: theme.colors.orange.accent,
              size: theme.typography[1].lineHeight,
            })}
          />
        ) : null}
      </Pressable>

      <Text highContrast={false} size="1">
        <TimeAgo date={comment.createdAt} />
      </Text>

      <View style={styles.footer}>
        <FooterButton
          color={!privacy && comment.liked === true ? 'orange' : undefined}
          compact
          icon={
            !privacy && comment.liked === true
              ? 'arrow-fat-up-fill'
              : 'arrow-fat-up'
          }
          label={a11y(comment.liked ? 'removeUpvote' : 'upvote')}
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked ? 0 : 1,
              postId: comment.post.id,
            })
          }}
        />

        <Text size="1" tabular>
          {f.number(comment.votes, {
            notation: 'compact',
          })}
        </Text>

        <FooterButton
          color={!privacy && comment.liked === false ? 'violet' : undefined}
          compact
          icon={
            !privacy && comment.liked === false
              ? 'arrow-fat-down-fill'
              : 'arrow-fat-down'
          }
          label={a11y(comment.liked === false ? 'removeDownvote' : 'downvote')}
          onPress={() => {
            vote({
              commentId: comment.id,
              direction: comment.liked === false ? 0 : -1,
              postId: comment.post.id,
            })
          }}
        />
      </View>

      {flair === 'emoji' ? (
        <FlairCard flair={comment.flair} type="emoji" />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  baby: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[1],
  },
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[4],
    width: theme.space[4],
  },
  main: (mt?: boolean, mb?: boolean) => ({
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    marginBottom: mb ? theme.space[3] : undefined,
    marginHorizontal: theme.space[3],
    marginTop: mt ? theme.space[3] : undefined,
  }),
  sticky: {
    marginRight: -theme.space[1],
  },
  user: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: theme.space[2],
  },
}))
