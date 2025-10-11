import { create as mutative } from 'mutative'
import { create } from 'zustand'

export type VideosPayload = {
  videos: Array<{
    percent: number
    url: string
  }>
}

type State = VideosPayload & {
  addVideo: (url: string, percent: number) => void
  removeVideo: (url: string) => void
}

export const useVideos = create<State>()((set, get) => ({
  addVideo(url, percent) {
    set({
      videos: mutative(get().videos, (draft) => {
        const exists = draft.find((item) => item.url === url)

        if (exists) {
          exists.percent = percent
        } else {
          draft.push({
            percent,
            url,
          })
        }
      }),
    })
  },
  removeVideo(url) {
    set({
      videos: get().videos.filter((item) => item.url !== url),
    })
  },
  videos: [],
}))

export function getActiveVideo(videos: VideosPayload['videos']) {
  if (videos.length === 0) {
    return
  }

  const max = Math.max(...videos.map((item) => item.percent))

  const top = videos.filter((item) => item.percent === max)

  if (max === 100 && top.length > 1) {
    const index = Math.floor(top.length / 2)

    return top[index]
  }

  return top[0]
}
