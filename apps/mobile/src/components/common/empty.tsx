import { View } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from './icon'
import { Text } from './text'

type Props = {
  message?: string
}

export function Empty({ message }: Props) {
  const frame = useSafeAreaFrame()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Icon
        color={theme.colors.red.a9}
        name="CloudRain"
        size={frame.width / 4}
      />

      {message ? (
        <Text size="4" weight="medium">
          {message}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space[4],
    justifyContent: 'center',
  },
}))
