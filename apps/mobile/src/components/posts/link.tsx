import { Image } from 'expo-image'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'
import { handleLink } from '~/lib/link'
import { getDimensions } from '~/lib/media'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostLinkCard({ margin = 0, post, style }: Props) {
  const common = useCommon()

  const { styles, theme } = useStyles(stylesheet)

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
          recyclingKey={post.id}
          source={image.url}
          style={styles.image(
            common.maxHeight,
            dimensions.height,
            dimensions.width,
          )}
        />
      ) : null}

      <View style={styles.footer}>
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
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  },
  image: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[4],
    marginHorizontal: theme.space[3],
    overflow: 'hidden',
  },
  url: {
    flex: 1,
  },
}))
