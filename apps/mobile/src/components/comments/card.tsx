import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { getDepthColor } from '~/lib/colors'
import { withoutAgo } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { CommentSaveCard } from './save'
import { CommentVoteCard } from './vote'

type Props = {
  collapsed?: boolean
  comment: CommentReply
  onReply?: () => void
  style?: StyleProp<ViewStyle>
}

export function CommentCard({ collapsed, comment, onReply, style }: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View
      pl="3"
      pt={collapsed ? '3' : undefined}
      style={[styles.main(comment.depth), style]}
    >
      {!collapsed ? (
        <Markdown
          meta={comment.media.meta}
          recyclingKey={comment.id}
          size="2"
          style={styles.body}
        >
          {comment.body}
        </Markdown>
      ) : null}

      <View align="center" direction="row" gap="4" mb="3">
        <Pressable
          hitSlop={theme.space[3]}
          onPress={() => {
            router.navigate({
              params: {
                name: removePrefix(comment.user.name),
              },
              pathname: '/users/[name]',
            })
          }}
        >
          <Text
            color={comment.op ? 'accent' : 'gray'}
            highContrast={false}
            size="1"
            weight="medium"
          >
            {comment.user.name}
          </Text>
        </Pressable>

        <Text highContrast={false} size="1">
          {withoutAgo(
            f.relativeTime(comment.createdAt, {
              style: 'narrow',
            }),
          )}
        </Text>

        {!collapsed ? (
          <>
            <CommentVoteCard comment={comment} />

            {onReply ? (
              <Pressable
                hitSlop={theme.space[4]}
                onPress={() => {
                  onReply()
                }}
              >
                <Icon
                  color={theme.colors.gray.a11}
                  name="ArrowBendUpLeft"
                  size={theme.space[4]}
                  weight="bold"
                />
              </Pressable>
            ) : null}

            <CommentSaveCard comment={comment} />
          </>
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginRight: theme.space[3],
    marginVertical: theme.space[3],
  },
  main: (depth: number) => {
    const color = getDepthColor(depth)

    return {
      backgroundColor: theme.colors[color].a2,
      borderLeftColor: depth > 0 ? theme.colors[color].a6 : undefined,
      borderLeftWidth: depth > 0 ? theme.space[1] : undefined,
      marginLeft: theme.space[3] * depth,
    }
  },
}))
