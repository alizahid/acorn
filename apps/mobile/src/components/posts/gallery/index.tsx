import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useImagePlaceholder } from '~/hooks/image'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { Text } from '../../common/text'
import { View } from '../../common/view'
import { PostGalleryModal } from './modal'

type Props = {
  crossPost?: boolean
  images: Array<PostMedia>
  nsfw?: boolean
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
}

export function PostGalleryCard({
  crossPost,
  images,
  nsfw,
  recyclingKey,
  style,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { blurNsfw } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const [visible, setVisible] = useState(false)

  const first = images[0]

  if (!first) {
    return null
  }

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={[styles.main(crossPost), style]}
      >
        <Image
          {...placeholder}
          recyclingKey={recyclingKey}
          source={first.thumbnail ?? first.url}
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
    alignItems: 'center',
    bottom: 0,
    gap: theme.space[4],
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
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
    maxHeight: runtime.screen.height * (crossPost ? 0.3 : 0.5),
    overflow: 'hidden',
  }),
}))
