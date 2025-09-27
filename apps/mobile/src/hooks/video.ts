/** biome-ignore-all lint/correctness/useHookAtTopLevel: go away */

import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import { File, Paths } from 'expo-file-system'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as MediaLibrary from 'expo-media-library'
import { FFmpegKit } from 'ffmpeg-kit-react-native'
import { useRef } from 'react'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import { usePreferences } from '~/stores/preferences'

import { getAlbum } from './image'

type DownloadVideoVariables = {
  url: string
}

export function useDownloadVideo() {
  const t = useTranslations('toasts.video')

  const { saveToAlbum } = usePreferences()

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

      const { granted } = await MediaLibrary.requestPermissionsAsync(
        !saveToAlbum,
      )

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const file = new File(Paths.cache, `${createId()}.mp4`)

      await FFmpegKit.execute(
        `-i "${variables.url}" -c:v copy -c:a aac ${file.uri}`,
      )

      if (saveToAlbum) {
        const album = await getAlbum()

        const asset = await MediaLibrary.createAssetAsync(file.uri)

        await MediaLibrary.addAssetsToAlbumAsync([asset], album)
      } else {
        await MediaLibrary.saveToLibraryAsync(file.uri)
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
