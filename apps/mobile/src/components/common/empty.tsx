import { Image } from 'expo-image'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
import notFound from '~/images/not-found.png'

import { Text } from './text'

type Props = {
  message?: string
}

export function Empty({ message }: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Image source={notFound} style={styles.image(common.frame.width)} />

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
