import { View } from 'react-native'
import ArrowFatDownFillIcon from 'react-native-phosphor/src/fill/ArrowFatDown'
import ArrowFatUpFillIcon from 'react-native-phosphor/src/fill/ArrowFatUp'
import ArrowFatDownIcon from 'react-native-phosphor/src/regular/ArrowFatDown'
import ArrowFatUpIcon from 'react-native-phosphor/src/regular/ArrowFatUp'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { useVote } from '~/hooks/mutations/posts/vote'
import { type FeedType } from '~/hooks/queries/posts/feed'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  feedType: FeedType
  post: Post
}

export function PostVote({ feedType, post }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = useVote()

  const Up = post.liked ? ArrowFatUpFillIcon : ArrowFatUpIcon
  const Down = post.liked === false ? ArrowFatDownFillIcon : ArrowFatDownIcon

  const color = theme.colors.grayA[post.read ? 11 : 12]

  return (
    <View
      style={[
        styles.main,
        post.liked
          ? styles.liked
          : post.liked === false
            ? styles.unliked
            : null,
        (post.media.images ?? post.media.video) ? styles.media : null,
      ]}
    >
      <Pressable
        onPress={() => {
          vote({
            direction: post.liked ? 0 : 1,
            feedType,
            postId: post.id,
          })
        }}
        style={styles.action}
      >
        <Up
          color={post.liked ? theme.colors.greenA[9] : color}
          size={theme.typography[2].lineHeight}
        />
      </Pressable>

      <Text style={styles.votes}>
        {f.number(post.votes, {
          notation: 'compact',
        })}
      </Text>

      <Pressable
        onPress={() => {
          vote({
            direction: post.liked === false ? 0 : -1,
            feedType,
            postId: post.id,
          })
        }}
        style={styles.action}
      >
        <Down
          color={post.liked === false ? theme.colors.redA[9] : color}
          size={theme.typography[2].lineHeight}
        />
      </Pressable>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    padding: theme.space[2],
  },
  liked: {
    backgroundColor: theme.colors.greenA[4],
  },
  main: {
    alignItems: 'center',
    borderRadius: theme.radius[3],
    flexDirection: 'row',
    marginRight: theme.space[2],
  },
  media: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  unliked: {
    backgroundColor: theme.colors.redA[4],
  },
  votes: {
    fontVariant: ['tabular-nums'],
  },
}))
