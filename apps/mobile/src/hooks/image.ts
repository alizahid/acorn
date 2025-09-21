import { useMutation } from '@tanstack/react-query'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as Clipboard from 'expo-clipboard'
import { File, Paths } from 'expo-file-system'
import { type ImageProps } from 'expo-image'
// biome-ignore lint/performance/noNamespaceImport: go away
import * as MediaLibrary from 'expo-media-library'
import { compact } from 'lodash'
import { useRef } from 'react'
import { Share } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { toast } from 'sonner-native'
import { useTranslations } from 'use-intl'

import placeholderDark from '~/assets/images/placeholder-dark.png'
import placeholderLight from '~/assets/images/placeholder-light.png'
import { usePreferences } from '~/stores/preferences'

export function useImagePlaceholder() {
  const { theme } = useUnistyles()

  return {
    placeholder: theme.variant === 'dark' ? placeholderDark : placeholderLight,
    placeholderContentFit: 'contain',
  } satisfies ImageProps
}

type DownloadImageVariables = {
  url: string
}

export function useDownloadImage() {
  const t = useTranslations('toasts.image')

  const { saveToAlbum } = usePreferences()

  const id = useRef<string | number>(undefined)

  const { isError, isPending, isSuccess, mutate } = useMutation<
    unknown,
    Error,
    DownloadImageVariables
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

      const file = await File.downloadFileAsync(variables.url, Paths.cache)

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
      toast.success(
        t('downloaded', {
          count: 1,
        }),
        {
          id: id.current,
        },
      )
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

type DownloadImagesVariables = {
  urls: Array<string>
}

export function useDownloadImages() {
  const t = useTranslations('toasts.image')

  const { saveToAlbum } = usePreferences()

  const id = useRef<string | number>(undefined)

  const { isError, isPending, isSuccess, mutate } = useMutation<
    unknown,
    Error,
    DownloadImagesVariables
  >({
    async mutationFn(variables) {
      id.current = toast.loading(t('downloadingImages'), {
        duration: Number.POSITIVE_INFINITY,
      })

      const { granted } = await MediaLibrary.requestPermissionsAsync(
        !saveToAlbum,
      )

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const files = await Promise.all(
        variables.urls.map((url) => File.downloadFileAsync(url, Paths.cache)),
      )

      if (saveToAlbum) {
        const assets = await Promise.all(
          files.map((file) => MediaLibrary.createAssetAsync(file.uri)),
        )

        const album = await getAlbum()

        await MediaLibrary.addAssetsToAlbumAsync(compact(assets), album)
      } else {
        await Promise.all(
          files.map((file) => MediaLibrary.saveToLibraryAsync(file.uri)),
        )
      }

      for (const file of files) {
        file.delete()
      }
    },
    onError(error) {
      toast.dismiss(id.current)

      toast.error(error.message)
    },
    onSuccess(_data, variables) {
      toast.success(
        t('downloaded', {
          count: variables.urls.length,
        }),
        {
          id: id.current,
        },
      )
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

type CopyImageVariables = {
  url: string
}

export function useCopyImage() {
  const t = useTranslations('toasts.image')

  const id = useRef<string | number>(undefined)

  const { isError, isPending, isSuccess, mutate } = useMutation<
    unknown,
    Error,
    CopyImageVariables
  >({
    async mutationFn(variables) {
      id.current = toast.loading(t('copying'), {
        duration: Number.POSITIVE_INFINITY,
      })

      const file = await File.downloadFileAsync(variables.url, Paths.cache)

      await Clipboard.setImageAsync(await file.base64())

      file.delete()
    },
    onError(error) {
      toast.dismiss(id.current)

      toast.error(error.message, {
        duration: Number.POSITIVE_INFINITY,
      })
    },
    onSuccess() {
      toast.success(t('copied'), {
        id: id.current,
      })
    },
  })

  return {
    copy: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

type ShareImageVariables = {
  url: string
}

export function useShareImage() {
  const t = useTranslations('toasts.image')

  const id = useRef<string | number>(undefined)

  const { isError, isPending, isSuccess, mutate } = useMutation<
    boolean,
    Error,
    ShareImageVariables
  >({
    async mutationFn(variables) {
      id.current = toast.loading(t('sharing'), {
        duration: Number.POSITIVE_INFINITY,
      })

      const file = await File.downloadFileAsync(variables.url, Paths.cache)

      const result = await Share.share({
        url: file.uri,
      })

      file.delete()

      return result.action === 'sharedAction'
    },
    onError(error) {
      toast.dismiss(id.current)

      toast.error(error.message)
    },
    onSuccess(data) {
      toast.success(t(data ? 'shared' : 'canceled'), {
        id: id.current,
      })
    },
  })

  return {
    isError,
    isPending,
    isSuccess,
    share: mutate,
  }
}

async function getAlbum() {
  const name = 'Acorn'

  const exists = await MediaLibrary.getAlbumAsync(name)

  if (exists) {
    return exists
  }

  return MediaLibrary.createAlbumAsync(name)
}
