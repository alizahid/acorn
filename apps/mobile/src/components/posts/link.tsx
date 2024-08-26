import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
import { useImagePlaceholder } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  margin?: number
  media?: PostMedia
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  url: string
}

export function PostLinkCard({
  margin = 0,
  media,
  recyclingKey,
  style,
  url,
}: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const handleLink = useLink()
  const placeholder = useImagePlaceholder()

  const frameWidth = common.frame.width - margin

  const dimensions = getDimensions(
    frameWidth,
    media ?? {
      height: 0,
      width: 0,
    },
  )

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
          style={styles.image(
            common.height.max,
            dimensions.height,
            dimensions.width,
          )}
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
  image: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
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
