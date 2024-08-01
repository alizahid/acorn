import { Image } from 'expo-image'
import * as Linking from 'expo-linking'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

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
  const frame = useSafeAreaFrame()

  const { styles, theme } = useStyles(stylesheet)

  const image = post.media.images?.at(0)

  return (
    <Pressable
      onPress={() => {
        if (!post.url) {
          return
        }

        void Linking.openURL(post.url)
      }}
      style={[styles.main, style]}
    >
      {image ? (
        <Image
          key={post.id}
          source={image.url}
          style={styles.image(frame.width - margin, image.height, image.width)}
        />
      ) : null}

      <View style={styles.footer}>
        <Icon
          color={theme.colors.gray.a11}
          name="Link"
          size={theme.typography[2].lineHeight}
        />

        <Text highContrast={false} lines={1} size="2">
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
  image: (frameWidth: number, height: number, width: number) =>
    getDimensions(frameWidth, {
      height,
      width,
    }),
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[4],
    marginHorizontal: theme.space[3],
    overflow: 'hidden',
  },
}))
