import { ImageBackground } from 'expo-image'
import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { View } from '~/components/common/view'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'

type Props = {
  children?: ReactNode
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  spoiler?: boolean
  thumbnail?: string
  video: PostMedia
}

export function VideoPlaceholder({
  children,
  compact,
  large,
  nsfw,
  spoiler,
  thumbnail,
  video,
}: Props) {
  const t = useTranslations('component.posts.video')

  const { blurNsfw, blurSpoiler } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  if (compact) {
    return (
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.compact(large)}
      >
        {children ?? (
          <View align="center" justify="center" style={styles.compactIcon}>
            <Icon
              color={theme.colors.accent.accent}
              name="Play"
              weight="fill"
            />

            {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
              <GalleryBlur />
            ) : null}
          </View>
        )}
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      accessibilityIgnoresInvertColors
      source={thumbnail ?? video.thumbnail}
      style={styles.main}
    >
      {children ?? (
        <View
          align="center"
          justify="center"
          style={styles.video(video.width / video.height)}
        >
          <Icon
            color={theme.colors.accent.accent}
            name="Play"
            size={theme.space[9]}
            weight="fill"
          />

          {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
            <GalleryBlur label={t(nsfw ? 'nsfw' : 'spoiler')} />
          ) : null}
        </View>
      )}
    </ImageBackground>
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
    backgroundColor: theme.colors.black.accentAlpha,
  }),
}))
