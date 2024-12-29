import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

type Props = BottomSheetBackdropProps

export function SheetBackdrop({
  animatedIndex,
  animatedPosition,
  style,
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <BottomSheetBackdrop
      animatedIndex={animatedIndex}
      animatedPosition={animatedPosition}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={[styles.main, style]}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.a9,
  },
}))
