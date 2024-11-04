import { type ReactNode } from 'react'
import { useSheetRouter } from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'

type Props = {
  right?: ReactNode
  title: string
}

export function SheetHeader({ right, title }: Props) {
  const { styles } = useStyles(stylesheet)

  const router = useSheetRouter()

  return (
    <View align="center" height="8" justify="center" style={styles.main}>
      <Text weight="bold">{title}</Text>

      {router?.canGoBack() ? (
        <HeaderButton
          icon="ArrowLeft"
          onPress={() => {
            router.goBack()
          }}
          style={[styles.action, styles.left]}
          weight="bold"
        />
      ) : null}

      {right ? (
        <View style={[styles.action, styles.right]}>{right}</View>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    bottom: 0,
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[4],
    borderTopRightRadius: theme.radius[4],
  },
  right: {
    right: 0,
  },
}))
