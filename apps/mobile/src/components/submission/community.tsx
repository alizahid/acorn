import { type Submission } from '@acorn/reddit'
import { Image } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '../common/text'

type Props = {
  community: Submission['community']
}

export function SubmissionCommunityCard({ community }: Props) {
  // a profile's name already reads `u/<name>`
  const name = community.user ? community.name : `r/${community.name}`

  return (
    <View style={styles.main}>
      <Image
        accessibilityIgnoresInvertColors
        source={community.image}
        style={styles.image}
      />

      <Text numberOfLines={1} style={styles.name} weight="medium">
        {name}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  main: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.space[2],
  },
  name: {
    flex: 1,
  },
}))
