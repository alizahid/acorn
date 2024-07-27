import { View } from 'react-native'
import SmileySadIcon from 'react-native-phosphor/src/fill/SmileySad'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from './text'

type Props = {
  message?: string
}

export function Empty({ message }: Props) {
  const frame = useSafeAreaFrame()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <SmileySadIcon color={theme.colors.red.a9} size={frame.width / 4} />

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
