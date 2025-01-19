import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

type Props = BottomSheetBackdropProps

export function SheetBackdrop({
  animatedIndex,
  animatedPosition,
  style,
}: Props) {
  const { themeOled } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <BottomSheetBackdrop
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      style={[styles.main(themeOled), style]}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (oled: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].overlay
      : theme.colors.gray.borderAlpha,
  }),
}))
