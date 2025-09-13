import { differenceInMonths } from 'date-fns'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
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
import { View } from '../common/view'
import { FlairCard, type FlairType } from '../posts/flair'
import { FooterButton } from '../posts/footer/button'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  flair?: FlairType
  top?: boolean
}

export function CommentMeta({ collapsed, comment, flair, top }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  const { vote } = useCommentVote()

  const baby =
    comment.user.createdAt &&
    differenceInMonths(new Date(), comment.user.createdAt) < 1
      ? comment.user.createdAt
      : null

  return (
    <View
      align="center"
      direction="row"
      gap="3"
      mb={top ? (collapsed ? '3' : undefined) : '3'}
      mt={top || collapsed ? '3' : undefined}
      mx="3"
    >
      {comment.sticky ? (
        <Icon
          name="pin.fill"
          style={styles.sticky}
          uniProps={(theme) => ({
            size: theme.typography[1].lineHeight,
            tintColor: theme.colors.red.accent,
          })}
        />
      ) : null}

      <Pressable
        align="center"
        direction="row"
        gap="2"
        hitSlop={space[3]}
        label={comment.user.name}
        onPress={() => {
          router.push({
            params: {
              name: removePrefix(comment.user.name),
            },
            pathname: '/users/[name]',
          })
        }}
        self="start"
      >
        {comment.user.image ? (
          <Image
            accessibilityIgnoresInvertColors
            source={comment.user.image}
            style={styles.image}
          />
        ) : null}

        <Text
          color={comment.op ? 'accent' : 'gray'}
          highContrast={!comment.op}
          lines={1}
          size="1"
          weight="medium"
        >
          {comment.user.name}
        </Text>

        {comment.edited ? (
          <Icon
            name="pencil"
            uniProps={(theme) => ({
              size: theme.typography[1].lineHeight,
              tintColor: theme.colors.orange.accent,
            })}
          />
        ) : null}

        {baby ? (
          <View align="center" direction="row" gap="1">
            <Icon
              name="figure.child"
              uniProps={(theme) => ({
                size: theme.typography[1].lineHeight,
                tintColor: theme.colors.orange.accent,
              })}
            />

            <Text highContrast={false} size="1">
              <TimeAgo unit="days">{baby}</TimeAgo>
            </Text>
          </View>
        ) : null}
      </Pressable>

      <Text highContrast={false} size="1">
        <TimeAgo>{comment.createdAt}</TimeAgo>
      </Text>

      <View align="center" direction="row" gap="1">
        <FooterButton
          color={comment.liked === true ? 'orange' : undefined}
          compact
          icon={comment.liked === true ? 'arrowshape.up.fill' : 'arrowshape.up'}
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
          color={comment.liked === false ? 'violet' : undefined}
          compact
          icon={
            comment.liked === false ? 'arrowshape.down.fill' : 'arrowshape.down'
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
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    height: theme.space[4],
    width: theme.space[4],
  },
  sticky: {
    marginRight: -theme.space[1],
  },
}))
