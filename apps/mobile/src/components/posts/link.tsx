import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
import { useImagePlaceholder } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { getDimensions } from '~/lib/media'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostLinkCard({ margin = 0, post, style }: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

  const handleLink = useLink()
  const placeholder = useImagePlaceholder()

  const frameWidth = common.frame.width - margin

  const image = post.media.images?.[0]

  const dimensions = getDimensions(
    frameWidth,
    image ?? {
      height: 0,
      width: 0,
    },
  )

  return (
    <Pressable
      mx="3"
      onPress={() => {
        if (!post.url) {
          return
        }

        handleLink(post.url)
      }}
      style={[styles.main, style]}
    >
      {image ? (
        <Image
          {...placeholder}
          recyclingKey={post.id}
          source={image.url}
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
          name="Link"
          size={theme.typography[2].lineHeight}
        />

        <Text highContrast={false} lines={1} size="2" style={styles.url}>
          {post.url}
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
