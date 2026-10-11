import { type CommentReply } from '@acorn/reddit'
import { create } from 'zustand'

export type TempPayload = {
  comment: CommentReply | null
}

export type State = TempPayload & {
  setComment: (comment: CommentReply | null) => void
}

export const useTemp = create<State>()((set) => ({
  comment: null,
  setComment(comment) {
    set({
      comment,
    })
  },
}))
