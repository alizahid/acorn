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
  compact?: boolean
  media?: PostMedia
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  url: string
}

export function PostLinkCard({
  compact,
  media,
  recyclingKey,
  style,
  url,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { handleLink } = useLink()
  const placeholder = useImagePlaceholder()

  if (compact) {
    return (
      <Pressable
        align="center"
        justify="center"
        onPress={() => {
          void handleLink(url)
        }}
        style={styles.compact}
      >
        <Icon color={theme.colors.accent.a9} name="Compass" />
      </Pressable>
    )
  }

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
  compact: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[2],
    height: theme.space[8],
    width: theme.space[8],
  },
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
