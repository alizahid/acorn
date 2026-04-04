import { Image } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type Submission } from '~/types/submission'

import { Text } from '../common/text'

type Props = {
  community: Submission['community']
}

export function SubmissionCommunityCard({ community }: Props) {
  const name = community.name.startsWith('u_')
    ? `u/${community.name.slice(2)}`
    : `r/${community.name}`

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
