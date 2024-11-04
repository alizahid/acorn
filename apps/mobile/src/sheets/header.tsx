import { useSheetRouter } from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'

type Props = {
  title: string
}

export function SheetHeader({ title }: Props) {
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
          style={styles.back}
          weight="bold"
        />
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  back: {
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[4],
    borderTopRightRadius: theme.radius[4],
  },
}))
