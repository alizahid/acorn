import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'

type Props = {
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  spoiler?: boolean
  video: PostMedia
}

export function VideoPlaceholder({
  compact,
  large,
  nsfw,
  spoiler,
  video,
}: Props) {
  const { blurNsfw, blurSpoiler } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  if (compact) {
    return (
      <View style={styles.compact(large)}>
        <Image
          accessibilityIgnoresInvertColors
          source={video.thumbnail}
          style={styles.compactImage}
        />

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon color={theme.colors.accent.accent} name="Play" weight="fill" />
        </View>

        {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
          <GalleryBlur />
        ) : null}
      </View>
    )
  }

  return (
    <View style={styles.main}>
      <Image
        accessibilityIgnoresInvertColors
        source={video.thumbnail}
        style={styles.video(video.width / video.height)}
      />

      <View align="center" justify="center" style={styles.icon}>
        <Icon
          color={theme.colors.accent.accent}
          name="Play"
          size={theme.space[9]}
          weight="fill"
        />
      </View>

      {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
        <GalleryBlur />
      ) : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.uiActive,
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
  compactVideo: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  icon: {
    ...StyleSheet.absoluteFillObject,
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
  },
  video: (aspectRatio: number) => ({
    aspectRatio,
  }),
}))
