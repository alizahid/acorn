import { Image } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '../common/text'
import { useSubmission } from './provider'

export function SubmissionCommunity() {
  const { submission } = useSubmission()

  const name = submission.community.user
    ? submission.community.name
    : `r/${submission.community.name}`

  return (
    <View style={styles.main}>
      {submission.community.image ? (
        <Image
          accessibilityIgnoresInvertColors
          source={submission.community.image}
          style={styles.image}
        />
      ) : null}

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
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[4],
  },
  name: {
    flex: 1,
  },
}))
