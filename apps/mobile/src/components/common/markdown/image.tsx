import { Image } from 'expo-image'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type PostImage } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: string
  image: PostImage
}

export function MarkdownImage({ caption, image }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Image
        source={image.url}
        style={{
          height: image.height,
          width: image.width,
        }}
      />

      {caption !== '' ? (
        <Text align="center" highContrast={false} size="2" weight="medium">
          {caption}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    gap: theme.space[2],
  },
}))
