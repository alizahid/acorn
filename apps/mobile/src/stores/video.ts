import { create } from 'zustand'

export type VideosPayload = {
  urls: Array<string>
}

type State = VideosPayload & {
  add: (url: string) => void
  remove: (url: string) => void
}

export const useVideos = create<State>()((set, get) => ({
  add(url) {
    set({
      urls: [url, ...get().urls],
    })
  },
  remove(url) {
    set({
      urls: get().urls.filter((item) => item !== url),
    })
  },
  urls: [],
}))
