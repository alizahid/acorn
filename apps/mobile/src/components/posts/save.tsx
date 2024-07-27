import BookmarkSimpleIcon from 'react-native-phosphor/src/duotone/BookmarkSimple'
import BookmarkSimpleFillIcon from 'react-native-phosphor/src/fill/BookmarkSimple'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostSave } from '~/hooks/mutations/posts/save'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Pressable } from '../common/pressable'

type Props = {
  feedType?: FeedType
  post: Post
  subreddit?: string
}

export function PostSaveCard({ feedType, post, subreddit }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { save } = usePostSave()

  const Icon = post.saved ? BookmarkSimpleFillIcon : BookmarkSimpleIcon

  const color = theme.colors.grayA[post.read ? 11 : 12]

  return (
    <Pressable
      onPress={() => {
        save({
          action: post.saved ? 'unsave' : 'save',
          feedType,
          postId: post.id,
          subreddit,
        })
      }}
      style={[styles.main, post.saved && styles.saved]}
    >
      <Icon
        color={post.saved ? theme.colors.white[12] : color}
        size={theme.typography[2].lineHeight}
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    borderRadius: theme.radius[3],
    height: theme.space[6],
    justifyContent: 'center',
    width: theme.space[6],
  },
  saved: {
    backgroundColor: theme.colors.accentA[9],
  },
}))
