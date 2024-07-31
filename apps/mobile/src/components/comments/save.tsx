import { useStyles } from 'react-native-unistyles'

import { useCommentSave } from '~/hooks/mutations/comments/save'
import { type CommentReply } from '~/types/comment'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  comment: CommentReply
  postId?: string
}

export function CommentSaveCard({ comment, postId }: Props) {
  const { theme } = useStyles()

  const { save } = useCommentSave()

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
        name="BookmarkSimple"
        size={theme.space[4]}
        weight={comment.saved ? 'fill' : 'duotone'}
      />
    </Pressable>
  )
}
