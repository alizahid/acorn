import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { usePreferences } from '~/stores/preferences'
import { type Flair } from '~/types/flair'

import { Text } from '../common/text'
import { View } from '../common/view'

export type FlairType = 'text' | 'emoji' | 'both'

type Props = {
  flair: Array<Flair>
  nsfw?: boolean
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  type?: FlairType
}

export function FlairCard({
  flair,
  nsfw,
  spoiler,
  style,
  type = 'both',
}: Props) {
  const t = useTranslations('component.posts.flair')

  const { showFlair } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const items = flair.filter((item) =>
    type === 'both' ? true : item.type === type,
  )

  if ((!showFlair || items.length === 0) && !nsfw && !spoiler) {
    return null
  }

  return (
    <View
      align="center"
      direction="row"
      gap="2"
      pointerEvents="none"
      style={style}
    >
      {nsfw ? (
        <View style={[styles.text, styles.nsfw]}>
          <Text contrast size="1" weight="bold">
            {t('nsfw')}
          </Text>
        </View>
      ) : null}

      {spoiler ? (
        <View style={[styles.text, styles.spoiler]}>
          <Text contrast size="1" weight="bold">
            {t('spoiler')}
          </Text>
        </View>
      ) : null}

      {showFlair
        ? items.map((item) => {
            if (item.type === 'emoji') {
              return (
                <Image key={item.id} source={item.value} style={styles.emoji} />
              )
            }

            return (
              <View key={item.id} style={styles.text}>
                <Text lines={1} size="1">
                  {item.value}
                </Text>
              </View>
            )
          })
        : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  emoji: {
    height: theme.typography[1].lineHeight + theme.space[1],
    width: theme.typography[1].lineHeight + theme.space[1],
  },
  nsfw: {
    backgroundColor: theme.colors.red.accent,
  },
  spoiler: {
    backgroundColor: theme.colors.green.accent,
  },
  text: {
    backgroundColor: theme.colors.accent.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    paddingHorizontal: theme.space[1] * 1.25,
    paddingVertical: theme.space[1] / 2,
  },
}))
