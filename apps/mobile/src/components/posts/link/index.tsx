import { Image } from 'expo-image'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { useHistory } from '~/hooks/history'
import { useImagePlaceholder } from '~/hooks/image'
import { useLink } from '~/hooks/link'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  media?: PostMedia
  recyclingKey?: string
  url: string
  onLongPress?: () => void
}

export function PostLinkCard({
  compact,
  crossPost,
  large,
  media,
  recyclingKey,
  url,
  onLongPress,
}: Props) {
  const a11y = useTranslations('a11y')

  const { handleLink } = useLink()
  const { addPost } = useHistory()

  const { seenOnMedia } = usePreferences(
    useShallow((state) => ({
      seenOnMedia: state.seenOnMedia,
    })),
  )

  styles.useVariants({
    compact,
    crossPost,
    large,
  })

  const placeholder = useImagePlaceholder()

  function onPress() {
    handleLink(url)

    if (recyclingKey && seenOnMedia) {
      addPost({
        id: recyclingKey,
      })
    }
  }

  if (compact) {
    return (
      <Pressable
        accessibilityLabel={a11y('viewLink')}
        onLongPress={onLongPress}
        onPress={onPress}
        style={styles.main}
      >
        {media?.thumbnail ? (
          <Image
            accessibilityIgnoresInvertColors
            source={media.thumbnail}
            style={styles.image}
          />
        ) : null}

        <View style={styles.icon}>
          <Icon
            name="compass"
            uniProps={(theme) => ({
              color: theme.colors.accent.accent,
            })}
          />
        </View>
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityLabel={a11y('viewLink')}
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.main}
    >
      {media ? (
        <Image
          {...placeholder}
          accessibilityIgnoresInvertColors
          recyclingKey={recyclingKey}
          source={media.url}
          style={styles.image}
        />
      ) : null}

      <View style={styles.link}>
        <Icon
          name="compass"
          uniProps={(theme) => ({
            size: theme.typography[2].lineHeight,
          })}
        />

        <Text numberOfLines={1} size="2" style={styles.url}>
          {url}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  icon: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: theme.colors.black.accentAlpha,
    justifyContent: 'center',
  },
  image: {
    aspectRatio: 2,
    variants: {
      compact: {
        true: {
          flex: 1,
        },
      },
    },
  },
  link: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
    variants: {
      crossPost: {
        true: {
          marginTop: theme.space[3],
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
  url: {
    flex: 1,
  },
}))
