import { ImageBackground } from 'expo-image'
import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native-unistyles'
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

  styles.useVariants({
    large,
  })

  if (compact) {
    return (
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.compact}
      >
        {children ?? (
          <View align="center" justify="center" style={styles.compactIcon}>
            <Icon name="play.fill" />

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
            name="play.fill"
            uniProps={(theme) => ({
              size: theme.space[9],
            })}
          />

          {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
            <GalleryBlur label={t(nsfw ? 'nsfw' : 'spoiler')} />
          ) : null}
        </View>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  compact: {
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
      large: {
        false: {
          borderRadius: theme.space[1],
          height: theme.space[8],
          width: theme.space[8],
        },
        true: {
          borderRadius: theme.space[2],
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
    },
  },
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
