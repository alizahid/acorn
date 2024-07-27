import { Image } from 'expo-image'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type PostImage } from '~/types/post'

import { Text } from '../text'

type Props = {
  caption?: string
  media: PostImage
}

export function MarkdownMedia({ caption, media }: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Image
        key={media.url}
        source={media.url}
        style={{
          height: media.height,
          width: media.width,
        }}
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
  main: {
    gap: theme.space[2],
  },
}))
