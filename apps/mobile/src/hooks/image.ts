import { useMutation } from '@tanstack/react-query'
import * as FileSystem from 'expo-file-system'
import { type ImageProps } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
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
  const { isError, isPending, isSuccess, mutate } = useMutation<
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
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}
