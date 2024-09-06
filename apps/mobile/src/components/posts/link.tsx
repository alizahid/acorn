import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useImagePlaceholder } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { type PostMedia } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  media?: PostMedia
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  url: string
}

export function PostLinkCard({ media, recyclingKey, style, url }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const handleLink = useLink()
  const placeholder = useImagePlaceholder()

  return (
    <Pressable
      mx="3"
      onPress={() => {
        void handleLink(url)
      }}
      style={[styles.main, style]}
    >
      {media ? (
        <Image
          {...placeholder}
          recyclingKey={recyclingKey}
          source={media.url}
          style={styles.image}
        />
      ) : null}

      <View align="center" direction="row" gap="3" p="3">
        <Icon
          color={theme.colors.gray.a11}
          name="Compass"
          size={theme.typography[2].lineHeight}
        />

        <Text highContrast={false} lines={1} size="2" style={styles.url}>
          {url}
        </Text>
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    aspectRatio: 2,
  },
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  },
  url: {
    flex: 1,
  },
}))
