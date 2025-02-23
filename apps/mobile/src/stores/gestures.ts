import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type GestureAction } from '~/components/common/gestures'
import { Store } from '~/lib/store'

export const GESTURES_KEY = 'gestures-storage'

export type GesturesPayload = {
  commentLeft: boolean
  commentLeftLong: GestureAction
  commentLeftShort: GestureAction
  commentRight: boolean
  commentRightLong: GestureAction
  commentRightShort: GestureAction
  postLeft: boolean
  postLeftLong: GestureAction
  postLeftShort: GestureAction
  postRight: boolean
  postRightLong: GestureAction
  postRightShort: GestureAction
}

type State = GesturesPayload & {
  update: (payload: Partial<GesturesPayload>) => void
}

export const useGestures = create<State>()(
  persist(
    (set) => ({
      commentLeft: true,
      commentLeftLong: 'downvote',
      commentLeftShort: 'upvote',
      commentRight: true,
      commentRightLong: 'save',
      commentRightShort: 'reply',
      postLeft: true,
      postLeftLong: 'downvote',
      postLeftShort: 'upvote',
      postRight: true,
      postRightLong: 'save',
      postRightShort: 'reply',
      update(payload) {
        set(payload)
      },
    }),
    {
      name: GESTURES_KEY,
      storage: new Store(GESTURES_KEY),
      version: 4,
    },
  ),
)
