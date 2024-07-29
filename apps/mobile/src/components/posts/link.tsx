import * as Linking from 'expo-linking'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostImageCard } from './image'

type Props = {
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
}

export function PostLinkCard({ margin = 0, post, style }: Props) {
  const { styles, theme } = useStyles(stylesheet)

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
      {post.media.images ? (
        <PostImageCard
          images={post.media.images}
          key={post.id}
          margin={margin + theme.space[5]}
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
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderRadius: theme.radius[4],
    marginHorizontal: theme.space[3],
    overflow: 'hidden',
  },
}))
