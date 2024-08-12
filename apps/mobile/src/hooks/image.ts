import { type ImageProps } from 'expo-image'
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
