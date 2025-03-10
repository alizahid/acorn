import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { Gallery } from '~/sheets/gallery'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Text } from '../../common/text'
import { ImageGrid } from './grid'

type Props = {
  compact?: boolean
  crossPost?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  onLongPress?: () => void
  recyclingKey?: string
  spoiler?: boolean
  style?: StyleProp<ViewStyle>
  viewing?: boolean
}

export function PostGalleryCard({
  compact,
  crossPost,
  images,
  large,
  nsfw,
  onLongPress,
  recyclingKey,
  spoiler,
  style,
  viewing,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { blurNsfw, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const first = images[0]

  if (!first) {
    return null
  }

  if (compact) {
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={() => {
          void Gallery.call({
            images,
          })

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={[styles.compact(large), style]}
      >
        <Image
          {...placeholder}
          priority={viewing ? 'high' : 'normal'}
          recyclingKey={recyclingKey}
          source={first.thumbnail}
          style={styles.compactImage}
        />

        {Boolean(nsfw && blurNsfw) || spoiler ? (
          <BlurView
            intensity={100}
            pointerEvents="none"
            style={[styles.blur, styles.compactIcon]}
            tint={theme.name}
          >
            <Icon
              color={theme.colors.accent.accent}
              name="Warning"
              size={theme.space[5]}
              weight="fill"
            />
          </BlurView>
        ) : null}
      </Pressable>
    )
  }

  return (
    <Pressable onLongPress={onLongPress} style={[styles.main, style]}>
      <ImageGrid
        crossPost={crossPost}
        images={images}
        onLongPress={onLongPress}
        onPress={(initial) => {
          void Gallery.call({
            images,
            initial,
          })

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        recyclingKey={recyclingKey}
        viewing={viewing}
      />

      {Boolean(nsfw && blurNsfw) || spoiler ? (
        <BlurView
          intensity={100}
          pointerEvents="none"
          style={styles.blur}
          tint={theme.name}
        >
          <Icon
            color={theme.colors.gray.text}
            name="Warning"
            size={theme.space[6]}
            weight="fill"
          />

          <Text weight="medium">{t(spoiler ? 'spoiler' : 'nsfw')}</Text>
        </BlurView>
      ) : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
  compactIcon: {
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  main: {
    justifyContent: 'center',
    maxHeight: runtime.screen.height * 0.6,
    overflow: 'hidden',
  },
}))
