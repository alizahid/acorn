import { Image } from 'expo-image'
import { useColorScheme } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'

import giphyDark from '~/assets/images/giphy-dark.png'
import giphyLight from '~/assets/images/giphy-light.png'

export default function Screen() {
  const scheme = useColorScheme()

  return (
    <ScrollView
      automaticallyAdjustContentInsets
      contentContainerStyle={styles.content}
    >
      <Image
        source={scheme === 'dark' ? giphyDark : giphyLight}
        style={styles.giphy}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.space[6],
    padding: theme.space[4],
  },
  giphy: {
    aspectRatio: 641 / 167,
  },
}))
