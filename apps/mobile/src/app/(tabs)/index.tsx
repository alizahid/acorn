import { FlashList } from '@shopify/flash-list'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { PostCard } from '~/components/posts/card'
import { useFeed } from '~/hooks/data/feed'
import { useFrame } from '~/hooks/frame'

export default function Screen() {
  const frame = useFrame()

  const { styles } = useStyles(stylesheet)

  const { posts } = useFeed('hot')

  return (
    <View style={styles.main}>
      <FlashList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list(
          frame.padding.top,
          frame.padding.bottom,
        )}
        data={posts}
        estimatedItemSize={frame.frame.width}
        renderItem={({ item }) => <PostCard post={item} />}
        scrollIndicatorInsets={frame.scroll}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  list: (top: number, bottom: number) => ({
    paddingBottom: bottom,
    paddingTop: top,
  }),
  main: {
    backgroundColor: theme.colors.gray[1],
    flex: 1,
  },
  separator: {
    height: theme.space[4],
  },
}))
