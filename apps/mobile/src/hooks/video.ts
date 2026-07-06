/** biome-ignore-all lint/correctness/useHookAtTopLevel: go away */

import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { File, Paths } from 'expo-file-system'
import { Asset, requestPermissionsAsync } from 'expo-media-library'
import { FFmpegKit } from 'ffmpeg-kit-react-native'
import { useRef } from 'react'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { getGif } from '~/lib/red-gifs'
import { usePreferences } from '~/stores/preferences'

import { getAlbum } from './image'

type DownloadVideoVariables = {
  url: string
  provider?: 'reddit' | 'red-gifs'
}

export function useDownloadVideo() {
  const t = useTranslations('toasts.video')

  const { saveToAlbum } = usePreferences(['saveToAlbum'])

  const id = useRef<string | number>(undefined)

  const { isError, isPending, isSuccess, mutate } = useMutation<
    unknown,
    Error,
    DownloadVideoVariables
  >({
    async mutationFn(variables) {
      id.current = toast.loading(t('downloading'), {
        duration: Number.POSITIVE_INFINITY,
      })

      const { granted } = await requestPermissionsAsync()

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const { url } =
        variables.provider === 'red-gifs'
          ? await getGif(variables.url)
          : variables

      const file = new File(Paths.cache, `${createId()}.mp4`)

      await FFmpegKit.execute(`-i "${url}" -c:v copy -c:a aac ${file.uri}`)

      if (saveToAlbum) {
        const album = await getAlbum()

        await Asset.create(file.uri, album)
      } else {
        await Asset.create(file.uri)
      }

      file.delete()
    },
    onError(error) {
      toast.dismiss(id.current)

      toast.error(error.message)
    },
    onSuccess() {
      toast.success(t('downloaded'), {
        id: id.current,
      })
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}
