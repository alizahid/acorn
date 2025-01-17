import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useImagePlaceholder } from '~/hooks/image'
import { cardMaxWidth, iPad } from '~/lib/common'
import { type PostMedia } from '~/types/post'

type Props = {
  crossPost?: boolean
  images: Array<PostMedia>
  onLongPress?: () => void
  onPress: (index: number) => void
  recyclingKey?: string
}

export function ImageGrid({
  crossPost,
  images,
  onLongPress,
  onPress,
  recyclingKey,
}: Props) {
  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  const placeholder = useImagePlaceholder()

  const one = images[0]
  const two = images[1]
  const three = images[2]
  const four = images[3]

  if (one && two && three && four) {
    return (
      <View direction="row" gap="2">
        <View gap="2">
          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(0)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={one.thumbnail}
              style={styles.image}
            />

            <Gif image={one} />
          </Pressable>

          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(1)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={two.thumbnail}
              style={styles.image}
            />

            <Gif image={two} />
          </Pressable>
        </View>

        <View gap="2">
          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(2)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={three.thumbnail}
              style={styles.image}
            />

            <Gif image={three} />
          </Pressable>

          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(3)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={four.thumbnail}
              style={styles.image}
            />

            <Gif image={four} />

            {images.length > 4 ? (
              <View style={[styles.label, styles.items]}>
                <Text contrast size="1" weight="medium">
                  {t('items', {
                    count: images.length,
                  })}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
    )
  }

  if (one && two && three) {
    return (
      <View direction="row" gap="2">
        <Pressable
          onLongPress={onLongPress}
          onPress={() => {
            onPress(0)
          }}
          style={styles.two(crossPost)}
        >
          <Image
            {...placeholder}
            recyclingKey={recyclingKey}
            source={one.thumbnail}
            style={styles.image}
          />

          <Gif image={one} />
        </Pressable>

        <View gap="2">
          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(1)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={two.thumbnail}
              style={styles.image}
            />

            <Gif image={two} />
          </Pressable>

          <Pressable
            onLongPress={onLongPress}
            onPress={() => {
              onPress(2)
            }}
            style={styles.three(crossPost)}
          >
            <Image
              {...placeholder}
              recyclingKey={recyclingKey}
              source={three.thumbnail}
              style={styles.image}
            />

            <Gif image={three} />
          </Pressable>
        </View>
      </View>
    )
  }

  if (one && two) {
    return (
      <View direction="row" gap="2">
        <Pressable
          onLongPress={onLongPress}
          onPress={() => {
            onPress(0)
          }}
          style={styles.two(crossPost)}
        >
          <Image
            {...placeholder}
            recyclingKey={recyclingKey}
            source={one.thumbnail}
            style={styles.image}
          />

          <Gif image={one} />
        </Pressable>

        <Pressable
          onLongPress={onLongPress}
          onPress={() => {
            onPress(1)
          }}
          style={styles.two(crossPost)}
        >
          <Image
            {...placeholder}
            recyclingKey={recyclingKey}
            source={two.thumbnail}
            style={styles.image}
          />

          <Gif image={two} />
        </Pressable>
      </View>
    )
  }

  if (one) {
    return (
      <Pressable
        onLongPress={onLongPress}
        onPress={() => {
          onPress(0)
        }}
        style={styles.one(one.width / one.height)}
      >
        <Image
          {...placeholder}
          recyclingKey={recyclingKey}
          source={one.thumbnail}
          style={styles.image}
        />

        <Gif image={one} />
      </Pressable>
    )
  }

  return null
}

type GifProps = {
  image: PostMedia
}

function Gif({ image }: GifProps) {
  const t = useTranslations('component.posts.gallery')

  const { styles } = useStyles(stylesheet)

  if (image.type === 'gif') {
    return (
      <View style={[styles.label, styles.gif]}>
        <Text contrast size="1" weight="medium">
          {t('gif')}
        </Text>
      </View>
    )
  }

  return null
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  gif: {
    left: theme.space[2],
  },
  image: {
    flex: 1,
  },
  items: {
    right: theme.space[2],
  },
  label: {
    backgroundColor: theme.colors.black.accentAlpha,
    borderCurve: 'continuous',
    borderRadius: theme.radius[2],
    bottom: theme.space[2],
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[1] / 2,
    position: 'absolute',
  },
  more: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  one: (aspectRatio: number) => ({
    aspectRatio,
  }),
  three: (crossPost?: boolean) => {
    const maxWidth =
      (iPad ? cardMaxWidth : runtime.screen.width) -
      (crossPost ? theme.space[3] * 2 : 0)

    return {
      height: 150 - theme.space[1],
      width: (maxWidth - theme.space[2]) / 2,
    }
  },
  two: (crossPost?: boolean) => {
    const maxWidth =
      (iPad ? cardMaxWidth : runtime.screen.width) -
      (crossPost ? theme.space[3] * 2 : 0)

    return {
      height: 300,
      width: (maxWidth - theme.space[2]) / 2,
    }
  },
}))
