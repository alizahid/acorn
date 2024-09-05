import { Image } from 'expo-image'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import notFound from '~/images/not-found.png'

import { Text } from './text'
import { View } from './view'

type Props = {
  message?: string
}

export function Empty({ message }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View align="center" flexGrow={1} gap="4" justify="center">
      <Image source={notFound} style={styles.image} />

      {message ? (
        <Text size="4" weight="medium">
          {message}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  image: {
    aspectRatio: 1,
    width: '100%',
  },
}))
