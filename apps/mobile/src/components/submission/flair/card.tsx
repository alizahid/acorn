import { type Submission } from '@acorn/reddit'
import { Image } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

type Props = {
  flair?: Submission['flair'][number]
}

export function FlairCard({ flair }: Props) {
  if (!flair) {
    return null
  }

  if (flair.type === 'richtext') {
    return (
      <View
        style={[styles.main(flair.color, flair.background), styles.richText]}
      >
        {flair.flair.map((item) => {
          if (item.type === 'emoji') {
            return (
              <Image
                accessibilityIgnoresInvertColors
                key={item.id}
                source={item.value}
                style={styles.emoji}
              />
            )
          }

          return (
            <View key={item.id}>
              <Text size="1" style={styles.label(flair.color)}>
                {item.value}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={[styles.main(flair.color, flair.background), styles.text]}>
      <Text size="1" style={styles.label(flair.color)}>
        {flair.text}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  emoji: {
    height: theme.typography[1].lineHeight,
    width: theme.typography[1].lineHeight,
  },
  label: (color: 'dark' | 'light') => ({
    color: color === 'dark' ? '#000' : '#fff',
  }),
  main: (color: 'dark' | 'light', bg?: string) => ({
    backgroundColor: bg ?? (color === 'light' ? '#000' : '#fff'),
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
  }),
  richText: {
    flexDirection: 'row',
    gap: theme.space[2],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  text: {
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
}))
