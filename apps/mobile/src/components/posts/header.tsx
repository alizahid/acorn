import { type ViewStyle } from 'react-native'
import {
  createStyleSheet,
  type UnistylesValues,
  useStyles,
} from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { IconButton } from '../common/icon-button'
import { View } from '../common/view'

type Props = {
  onPress?: (commentId?: string) => void
  parentId?: string
}

export function PostHeader({ onPress, parentId }: Props) {
  const { themeOled, themeTint } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <View
      direction="row"
      mt="2"
      style={styles.main(themeOled, themeTint) as ViewStyle}
    >
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
  main: (oled: boolean, tint: boolean) => {
    const base: UnistylesValues = {
      backgroundColor: oled
        ? oledTheme[theme.name].bg
        : theme.colors[tint ? 'accent' : 'gray'].ui,
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
