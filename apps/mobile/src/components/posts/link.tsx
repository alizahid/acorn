import { Image } from 'expo-image'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  media?: PostMedia
  onLongPress?: () => void
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  url: string
}

export function PostLinkCard({
  compact,
  crossPost,
  large,
  media,
  onLongPress,
  recyclingKey,
  style,
  url,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { seenOnMedia, themeOled } = usePreferences()
  const { handleLink } = useLink()
  const { addPost } = useHistory()

  const placeholder = useImagePlaceholder()

  if (compact) {
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={() => {
          void handleLink(url)

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={styles.compact(large)}
      >
        {media?.thumbnail ? (
          <Image source={media.thumbnail} style={styles.compactImage} />
        ) : null}

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon color={theme.colors.accent.accent} name="Compass" />
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      mx="3"
      onLongPress={onLongPress}
      onPress={() => {
        void handleLink(url)

        if (recyclingKey && seenOnMedia) {
          addPost({
            id: recyclingKey,
          })
        }
      }}
      style={[styles.main(themeOled, crossPost), style]}
    >
      {media ? (
        <Image
          {...placeholder}
          recyclingKey={recyclingKey}
          source={media.url}
          style={styles.image}
        />
      ) : null}

      <View align="center" direction="row" gap="3" p="3">
        <Icon
          color={theme.colors.gray.textLow}
          name="Compass"
          size={theme.typography[2].lineHeight}
        />

        <Text highContrast={false} lines={1} size="2" style={styles.url}>
          {url}
        </Text>
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
  compactIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  image: {
    aspectRatio: 2,
  },
  main: (oled: boolean, crossPost?: boolean) => ({
    backgroundColor: theme.colors.gray[oled ? 'bgAlt' : 'uiActive'],
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    marginTop: crossPost ? theme.space[3] : undefined,
    overflow: 'hidden',
  }),
  url: {
    flex: 1,
  },
}))
