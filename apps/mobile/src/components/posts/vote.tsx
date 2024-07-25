import { View } from 'react-native'
import ArrowFatDownFillIcon from 'react-native-phosphor/src/fill/ArrowFatDown'
import ArrowFatUpFillIcon from 'react-native-phosphor/src/fill/ArrowFatUp'
import ArrowFatDownIcon from 'react-native-phosphor/src/regular/ArrowFatDown'
import ArrowFatUpIcon from 'react-native-phosphor/src/regular/ArrowFatUp'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  feedType?: FeedType
  post: Post
}

export function PostVote({ feedType, post }: Props) {
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  const Up = post.liked ? ArrowFatUpFillIcon : ArrowFatUpIcon
  const Down = post.liked === false ? ArrowFatDownFillIcon : ArrowFatDownIcon

  const color = theme.colors.grayA[post.read ? 11 : 12]

  return (
    <View style={styles.main}>
      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            direction: post.liked ? 0 : 1,
            feedType,
            postId: post.id,
          })
        }}
      >
        <Up
          color={post.liked ? theme.colors.greenA[9] : color}
          size={theme.typography[2].lineHeight}
        />
      </Pressable>

      <Text size="2" tabular>
        {f.number(post.votes, {
          notation: 'compact',
        })}
      </Text>

      <Pressable
        hitSlop={theme.space[4]}
        onPress={() => {
          vote({
            direction: post.liked === false ? 0 : -1,
            feedType,
            postId: post.id,
          })
        }}
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
  main: {
    alignItems: 'center',
    borderRadius: theme.radius[3],
    flexDirection: 'row',
    gap: theme.space[2],
  },
}))
