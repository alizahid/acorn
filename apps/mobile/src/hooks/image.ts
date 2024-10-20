import { useMutation } from '@tanstack/react-query'
import * as Clipboard from 'expo-clipboard'
import * as FileSystem from 'expo-file-system'
import { type ImageProps } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
import { useRef } from 'react'
import { useColorScheme } from 'react-native'

import placeholderDark from '~/images/placeholder-dark.png'
import placeholderLight from '~/images/placeholder-light.png'

export function useImagePlaceholder() {
  const scheme = useColorScheme()

  return {
    placeholder: scheme === 'dark' ? placeholderDark : placeholderLight,
    placeholderContentFit: 'contain',
  } satisfies ImageProps
}

export function useDownloadImage() {
  const timer = useRef<NodeJS.Timeout>()

  const { isError, isPending, isSuccess, mutate, reset } = useMutation<
    unknown,
    Error,
    {
      url: string
    }
  >({
    async mutationFn(variables) {
      const uri = new URL(variables.url)

      const { granted } = await MediaLibrary.requestPermissionsAsync(true)

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const download = FileSystem.createDownloadResumable(
        variables.url,
        `${String(FileSystem.documentDirectory)}${uri.pathname.split('/').pop()!}`,
      )

      const result = await download.downloadAsync()

      if (!result) {
        throw new Error('Download failed')
      }

      await MediaLibrary.saveToLibraryAsync(result.uri)

      await FileSystem.deleteAsync(result.uri)
    },
    onSettled() {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        reset()
      }, 5_000)
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

export function useCopyImage() {
  const timer = useRef<NodeJS.Timeout>()

  const { isError, isPending, isSuccess, mutate, reset } = useMutation<
    unknown,
    Error,
    {
      url: string
    }
  >({
    async mutationFn(variables) {
      const uri = new URL(variables.url)

      const { granted } = await MediaLibrary.requestPermissionsAsync(true)

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const download = FileSystem.createDownloadResumable(
        variables.url,
        `${String(FileSystem.documentDirectory)}${uri.pathname.split('/').pop()!}`,
      )

      const result = await download.downloadAsync()

      if (!result) {
        throw new Error('Download failed')
      }

      const base64 = await FileSystem.readAsStringAsync(result.uri, {
        encoding: 'base64',
      })

      await Clipboard.setImageAsync(base64)

      await FileSystem.deleteAsync(result.uri)
    },
    onSettled() {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        reset()
      }, 5_000)
    },
  })

  return {
    copy: mutate,
    isError,
    isPending,
    isSuccess,
  }
}
