import { create as mutative } from 'mutative'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Store } from '~/lib/store'

export const HISTORY_KEY = 'history-storage'

export type HistoryPayload = {
  posts: Array<string>
}

type State = HistoryPayload & {
  addPost: (id: string) => void
  removePost: (id: string) => void
  togglePost: (id: string) => void
}

export const useHistory = create<State>()(
  persist(
    (set, get) => ({
      addPost(id) {
        set({
          posts: mutative(get().posts, (draft) => {
            if (!draft.includes(id)) {
              draft.push(id)
            }
          }),
        })
      },
      posts: [],
      removePost(id) {
        set({
          posts: get().posts.filter((previous) => previous !== id),
        })
      },
      togglePost(id) {
        set({
          posts: mutative(get().posts, (draft) => {
            const index = draft.indexOf(id)

            if (index >= 0) {
              draft.splice(index, 1)
            } else {
              draft.push(id)
            }
          }),
        })
      },
    }),
    {
      name: HISTORY_KEY,
      storage: new Store(HISTORY_KEY),
    },
  ),
)
