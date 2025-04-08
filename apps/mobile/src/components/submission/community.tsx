import { Image } from 'expo-image'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Submission } from '~/types/submission'

import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  community: Submission['community']
}

export function SubmissionCommunityCard({ community }: Props) {
  const { styles } = useStyles(stylesheet)

  const name = community.name.startsWith('u_')
    ? `u/${community.name.slice(2)}`
    : `r/${community.name}`

  return (
    <View align="center" direction="row" flex={1} gap="2">
      <Image
        accessibilityIgnoresInvertColors
        source={community.image}
        style={styles.image}
      />

      <Text lines={1} style={styles.name} weight="medium">
        {name}
      </Text>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  name: {
    flex: 1,
  },
}))
