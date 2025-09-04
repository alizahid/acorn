import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { StyleSheet } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

type Props = BottomSheetBackdropProps

export function SheetBackdrop({
  animatedIndex,
  animatedPosition,
  style,
}: Props) {
  const { themeOled } = usePreferences()

  styles.useVariants({
    oled: themeOled,
  })

  return (
    <BottomSheetBackdrop
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      style={[styles.main, style]}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.borderAlpha,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].overlay,
        },
      },
    },
  },
}))
