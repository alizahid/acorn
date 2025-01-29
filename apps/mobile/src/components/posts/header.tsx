import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'

import { IconButton } from '../common/icon-button'
import { View } from '../common/view'

type Props = {
  onPress?: (commentId?: string) => void
  parentId?: string
}

export function PostHeader({ onPress, parentId }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View direction="row" style={styles.main() as ViewStyle}>
      <IconButton
        icon={{
          name: 'ArrowArcLeft',
          weight: 'bold',
        }}
        onPress={() => {
          onPress?.()
        }}
      />

      <IconButton
        icon={{
          name: 'ArrowElbowLeft',
          weight: 'bold',
        }}
        onPress={() => {
          onPress?.(parentId)
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: () => {
    const base: UnistylesValues = {
      backgroundColor: theme.colors.gray.ui,
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
