import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { View } from '~/components/common/view'
import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Text } from '../../common/text'
import { ImageGrid } from './grid'
import { PostGalleryModal } from './modal'

type Props = {
  compact?: boolean
  crossPost?: boolean
  images: Array<PostMedia>
  large?: boolean
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  compact,
  crossPost,
  images,
  large,
  nsfw,
  recyclingKey,
  style,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { blurNsfw, seenOnMedia } = usePreferences()
  const { addPost } = useHistory()

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState<number>()

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
          style={[styles.compact(large), style]}
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
        <View style={[styles.main(crossPost), style]}>
          <ImageGrid
            images={images}
            onPress={(next) => {
              setIndex(next)
              setVisible(true)

              if (recyclingKey && seenOnMedia) {
                addPost({
                  id: recyclingKey,
                })
              }
            }}
            recyclingKey={recyclingKey}
          />

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
        </View>
      )}

      <PostGalleryModal
        images={images}
        initialIndex={index}
        onClose={() => {
          setIndex(undefined)
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
  compact: (large?: boolean) => ({
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
