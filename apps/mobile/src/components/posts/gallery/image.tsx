import { Image } from 'expo-image'
import { useEffect, useRef, useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { useImagePlaceholder } from '~/hooks/image'
import { type PostMedia } from '~/types/post'

type Props = {
  image: PostMedia
  recyclingKey?: string
}

export function GalleryImage({ image, recyclingKey }: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const ref = useRef<Image>(null)

  const [loaded, setLoaded] = useState(!image.thumbnail)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (image.thumbnail) {
      void Image.prefetch(image.url).then(() => {
        setLoaded(true)
      })
    }
  }, [image.thumbnail, image.url])

  return (
    <Image
      {...placeholder}
      contentFit="contain"
      pointerEvents="box-none"
      recyclingKey={recyclingKey}
      ref={ref}
      source={loaded ? image.url : image.thumbnail}
      style={styles.main}
    >
      {image.type === 'gif' ? (
        <View style={styles.controls(image.width / image.height)}>
          <View pointerEvents="none" style={styles.gif}>
            <Text contrast size="1">
              {t('gif')}
            </Text>
          </View>

          <HeaderButton
            icon={playing ? 'Pause' : 'Play'}
            onPress={() => {
              if (playing) {
                void ref.current?.stopAnimating()
              } else {
                void ref.current?.startAnimating()
              }

              setPlaying(!playing)
            }}
            style={styles.play}
            weight="fill"
          />
        </View>
      ) : null}
    </Image>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  controls: (aspectRatio: number) => ({
    aspectRatio,
    marginVertical: 'auto',
  }),
  gif: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    left: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  image: {
    flex: 1,
  },
  main: {
    flex: 1,
  },
  play: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
