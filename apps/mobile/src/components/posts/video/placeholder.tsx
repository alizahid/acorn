import { VisibilitySensor } from '@futurejj/react-native-visibility-sensor'
import { ImageBackground } from 'expo-image'
import { type VideoSource } from 'expo-video'
import { useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { useFocused } from '~/hooks/focus'
import { previewVideo } from '~/lib/preview'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { GalleryBlur } from '../gallery/blur'
import { VideoPlayer } from './player'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  source?: VideoSource
  spoiler?: boolean
  thumbnail?: string
  video: PostMedia
}

export function VideoPlaceholder({
  compact,
  crossPost,
  large,
  nsfw,
  recyclingKey,
  source,
  spoiler,
  thumbnail,
  video,
}: Props) {
  const t = useTranslations('component.posts.video')
  const a11y = useTranslations('a11y')

  const { blurNsfw, blurSpoiler } = usePreferences()

  const { focused } = useFocused()

  styles.useVariants({
    compact,
    crossPost,
    large,
  })

  const [visible, setVisible] = useState(false)

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
        <Pressable
          accessibilityLabel={a11y('viewVideo')}
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
      </ImageBackground>
    )
  }

  return (
    <VisibilitySensor
      onChange={(next) => {
        setVisible(next)
      }}
    >
      <ImageBackground
        accessibilityIgnoresInvertColors
        source={thumbnail ?? video.thumbnail}
        style={styles.main}
      >
        {focused && visible ? (
          <VideoPlayer
            nsfw={nsfw}
            recyclingKey={recyclingKey}
            spoiler={spoiler}
            video={video}
          />
        ) : (
          <Pressable
            accessibilityLabel={a11y('viewVideo')}
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
    </VisibilitySensor>
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
    backgroundColor: theme.colors.black.accentAlpha,
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
      crossPost: {
        true: {
          marginHorizontal: 0,
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
  }),
}))
