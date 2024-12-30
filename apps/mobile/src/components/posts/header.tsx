import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'

import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  onPress?: (commentId?: string) => void
  parentId?: string
}

export function PostHeader({ onPress, parentId }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View direction="row" style={styles.main() as ViewStyle}>
      <HeaderButton
        color="accent"
        icon="ArrowArcLeft"
        onPress={() => {
          onPress?.()
        }}
        weight="bold"
      />

      <HeaderButton
        color="accent"
        icon="ArrowElbowLeft"
        onPress={() => {
          onPress?.(parentId)
        }}
        weight="bold"
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: () => {
    const base: UnistylesValues = {
      backgroundColor: theme.colors.gray.a3,
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius[3],
        maxWidth: cardMaxWidth,
        width: '100%',
      }
    }

    return base
  },
}))
