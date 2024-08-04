import { Image } from 'expo-image'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type PostMedia } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: string
  media: PostMedia
}

export function MarkdownMedia({ caption, media }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Image
        key={media.url}
        source={media.url}
        style={styles.image(media.height, media.width)}
      />

      {caption && caption !== '' ? (
        <Text align="center" highContrast={false} size="2" weight="medium">
          {caption}
        </Text>
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: (height: number, width: number) => ({
    height,
    width,
  }),
  main: {
    gap: theme.space[2],
  },
}))
