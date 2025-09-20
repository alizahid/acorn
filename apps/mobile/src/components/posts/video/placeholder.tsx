import { ImageBackground } from 'expo-image'
import { type VideoSource } from 'expo-video'
import { type ReactNode } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { previewVideo } from '~/lib/preview'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'

type Props = {
  children?: ReactNode
  compact?: boolean
  large?: boolean
  nsfw?: boolean
  source?: VideoSource
  spoiler?: boolean
  thumbnail?: string
  video: PostMedia
}

export function VideoPlaceholder({
  children,
  compact,
  large,
  nsfw,
  source,
  spoiler,
  thumbnail,
  video,
}: Props) {
  const t = useTranslations('component.posts.video')
  const a11y = useTranslations('a11y')

  const { blurNsfw, blurSpoiler } = usePreferences()

  styles.useVariants({
    compact,
    large,
  })

  function onPress() {
    previewVideo({
      ...video,
      url: (typeof source === 'object' ? source?.uri : undefined) ?? video.url,
    })
  }

  if (compact) {
    return (
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.main}
      >
        {children ?? (
          <Pressable
            accessibilityLabel={a11y('play')}
            align="center"
            justify="center"
            onPress={onPress}
            style={styles.icon}
          >
            <Icon name="play.fill" />

            {Boolean(nsfw && blurNsfw) || Boolean(spoiler && blurSpoiler) ? (
              <GalleryBlur />
            ) : null}
          </Pressable>
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
        <Pressable
          accessibilityLabel={a11y('play')}
          align="center"
          justify="center"
          onPress={onPress}
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
        </Pressable>
      )}
    </ImageBackground>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  icon: {
    ...StyleSheet.absoluteFillObject,
    variants: {
      compact: {
        true: {
          backgroundColor: theme.colors.black.accentAlpha,
        },
      },
    },
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
    variants: {
      compact: {
        default: {
          marginHorizontal: -theme.space[3],
        },
        true: {
          backgroundColor: theme.colors.gray.uiActive,
          borderCurve: 'continuous',
        },
      },
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
  video: (aspectRatio: number) => ({
    aspectRatio,
    backgroundColor: theme.colors.black.accentAlpha,
  }),
}))
