import { useFocusEffect, useNavigation } from 'expo-router'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { PostHeader } from '~/components/posts/header'
import { PostList } from '~/components/posts/list'
import { usePreferences } from '~/stores/preferences'

export default function Screen() {
  const navigation = useNavigation()

  const { styles } = useStyles(stylesheet)

  const { feed, updatePreferences } = usePreferences()

  useFocusEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <PostHeader
          onChange={(next) => {
            updatePreferences({
              feed: next,
            })
          }}
          type={feed}
        />
      ),
    })
  })

  return (
    <View style={styles.main}>
      <PostList type={feed} />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[1],
    flex: 1,
  },
}))
