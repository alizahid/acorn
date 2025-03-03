import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePreferences } from '~/stores/preferences'
import { type Flair } from '~/types/flair'

import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  flair: Array<Flair>
  style?: StyleProp<ViewStyle>
}

export function FlairCard({ flair, style }: Props) {
  const { showFlair } = usePreferences()

  const { styles } = useStyles(stylesheet)

  if (!showFlair || flair.length === 0) {
    return null
  }

  return (
    <View
      align="center"
      direction="row"
      gap="2"
      mb="3"
      mx="3"
      pointerEvents="none"
      style={style}
    >
      {flair.map((item) => {
        if (item.type === 'emoji') {
          return (
            <Image key={item.id} source={item.value} style={styles.emoji} />
          )
        }

        return (
          <View key={item.id} style={styles.text}>
            <Text lines={1} size="1">
              {item.value}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  emoji: {
    height: theme.typography[1].lineHeight + theme.space[1],
    width: theme.typography[1].lineHeight + theme.space[1],
  },
  text: {
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1] * 1.25,
    paddingVertical: theme.space[1] / 2,
  },
}))
