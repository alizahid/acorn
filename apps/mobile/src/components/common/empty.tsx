import { Image } from 'expo-image'
import { View } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import notFound from '~/images/not-found.png'

import { Text } from './text'

type Props = {
  message?: string
}

export function Empty({ message }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Image source={notFound} style={styles.image(frame.width)} />

      {message ? (
        <Text size="4" weight="medium">
          {message}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: (size: number) => ({
    height: size,
    width: size,
  }),
  main: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space[4],
    justifyContent: 'center',
  },
}))
