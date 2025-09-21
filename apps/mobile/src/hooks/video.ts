/** biome-ignore-all lint/correctness/useHookAtTopLevel: go away */

import { createVideoPlayer, useVideoPlayer, type VideoPlayer } from 'expo-video'
import { create } from 'mutative'
import { useEffect, useMemo } from 'react'

import { usePreferences } from '~/stores/preferences'

let players: Record<
  string,
  {
    listeners: number
    player: VideoPlayer
  }
> = {}

const store = {
  add(url: string) {
    const exists = players[url]

    if (exists) {
      players = create(players, (draft) => {
        if (draft[url]) {
          draft[url].listeners += 1
        }
      })

      return exists.player
    }

    const next = createVideoPlayer(url)

    players = create(players, (draft) => {
      draft[url] = {
        listeners: 1,
        player: next,
      }
    })

    return next
  },
  remove(url: string) {
    const exists = players[url]

    if (!exists) {
      return
    }

    if (exists.listeners > 1) {
      players = create(players, (draft) => {
        if (draft[url]) {
          draft[url].listeners -= 1
        }
      })

      return
    }

    exists.player.release()

    players = create(players, (draft) => {
      delete draft[url]
    })
  },
}

const enabled = usePreferences.getState()._experimental_video

export function useVideo(url: string, setup?: (instance: VideoPlayer) => void) {
  if (!enabled) {
    return useVideoPlayer(url, setup)
  }

  const player = useMemo(() => {
    const next = store.add(url)

    setup?.(next)

    return next
  }, [setup, url])

  useEffect(
    () => () => {
      store.remove(url)
    },
    [url],
  )

  return player
}
