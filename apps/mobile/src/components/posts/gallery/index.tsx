import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Text } from '../../common/text'
import { View } from '../../common/view'
import { PostGalleryModal } from './modal'

type Props = {
  compact?: boolean
  crossPost?: boolean
  images: Array<PostMedia>
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  compact,
  crossPost,
  images,
  nsfw,
  recyclingKey,
  style,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { blurNsfw, largeThumbnails, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const [visible, setVisible] = useState(false)

  const first = images[0]

  if (!first) {
    return null
  }

  return (
    <>
      {compact ? (
        <Pressable
          onPress={() => {
            setVisible(true)

            if (recyclingKey && seenOnMedia) {
              addPost({
                id: recyclingKey,
              })
            }
          }}
          style={[styles.compact(largeThumbnails), style]}
        >
          <Image
            {...placeholder}
            recyclingKey={recyclingKey}
            source={first.thumbnail}
            style={styles.compactImage}
          />

          {nsfw && blurNsfw ? (
            <BlurView
              intensity={100}
              pointerEvents="none"
              style={[styles.blur, styles.compactIcon]}
            >
              <Icon
                color={theme.colors.accent.a9}
                name="Warning"
                size={theme.space[5]}
                weight="fill"
              />
            </BlurView>
          ) : null}
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            setVisible(true)

            if (recyclingKey && seenOnMedia) {
              addPost({
                id: recyclingKey,
              })
            }
          }}
          style={[styles.main(crossPost), style]}
        >
          <Image
            {...placeholder}
            recyclingKey={recyclingKey}
            source={first.thumbnail}
            style={styles.image(first.width / first.height)}
          />

          {first.type === 'gif' ? (
            <View style={[styles.label, styles.gif]}>
              <Text contrast size="1" weight="medium">
                {t('gif')}
              </Text>
            </View>
          ) : null}

          {nsfw && blurNsfw ? (
            <BlurView intensity={100} pointerEvents="none" style={styles.blur}>
              <Icon
                color={theme.colors.gray.a12}
                name="Warning"
                size={theme.space[6]}
                weight="fill"
              />

              <Text weight="medium">{t('nsfw')}</Text>
            </BlurView>
          ) : null}

          {images.length > 1 ? (
            <View style={[styles.label, styles.count]}>
              <Text contrast size="1" tabular>
                {t('items', {
                  count: images.length,
                })}
              </Text>
            </View>
          ) : null}
        </Pressable>
      )}

      <PostGalleryModal
        images={images}
        onClose={() => {
          setVisible(false)
        }}
        recyclingKey={recyclingKey}
        visible={visible}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: (large: boolean) => ({
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
  compactIcon: {
    backgroundColor: theme.colors.black.a9,
  },
  compactImage: {
    flex: 1,
  },
  count: {
    right: theme.space[2],
  },
  gif: {
    left: theme.space[2],
  },
  image: (aspectRatio: number) => ({
    aspectRatio,
  }),
  label: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  main: (crossPost?: boolean) => ({
    justifyContent: 'center',
    maxHeight: runtime.screen.height * (crossPost ? 0.4 : 0.8),
    overflow: 'hidden',
  }),
}))
