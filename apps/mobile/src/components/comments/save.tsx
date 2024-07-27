import BookmarkSimpleIcon from 'react-native-phosphor/src/duotone/BookmarkSimple'
import BookmarkSimpleFillIcon from 'react-native-phosphor/src/fill/BookmarkSimple'
import { useStyles } from 'react-native-unistyles'

import { useCommentSave } from '~/hooks/mutations/comments/save'
import { type Comment } from '~/types/comment'

import { Pressable } from '../common/pressable'

type Props = {
  comment: Comment
  postId?: string
}

export function CommentSaveCard({ comment, postId }: Props) {
  const { theme } = useStyles()

  const { save } = useCommentSave()

  const Icon = comment.saved ? BookmarkSimpleFillIcon : BookmarkSimpleIcon

  const color = theme.colors.gray.a11

  return (
    <Pressable
      hitSlop={theme.space[4]}
      onPress={() => {
        save({
          action: comment.saved ? 'unsave' : 'save',
          commentId: comment.id,
          postId,
        })
      }}
    >
      <Icon
        color={comment.saved ? theme.colors.accent.a9 : color}
        size={theme.typography[1].lineHeight}
      />
    </Pressable>
  )
}
