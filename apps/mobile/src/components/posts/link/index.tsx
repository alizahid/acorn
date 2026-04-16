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

import { LinkMenu } from './menu'

type Props = {
  compact?: boolean
  crossPost?: boolean
  large?: boolean
  media?: PostMedia
  recyclingKey?: string
  url: string
}

export function PostLinkCard({
  compact,
  crossPost,
  large,
  media,
  recyclingKey,
  url,
}: Props) {
  const a11y = useTranslations('a11y')

  const { seenOnMedia, themeOled } = usePreferences(
    useShallow((s) => ({
      seenOnMedia: s.seenOnMedia,
      themeOled: s.themeOled,
    })),
  )
  const { handleLink } = useLink()
  const { addPost } = useHistory()

  styles.useVariants({
    compact,
    crossPost,
    large,
    oled: themeOled,
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
      <LinkMenu url={url}>
        <Pressable
          accessibilityLabel={a11y('viewLink')}
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
              name="safari"
              uniProps={(theme) => ({
                tintColor: theme.colors.accent.accent,
              })}
            />
          </View>
        </Pressable>
      </LinkMenu>
    )
  }

  return (
    <LinkMenu url={url}>
      <Pressable
        accessibilityLabel={a11y('viewLink')}
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
            name="safari"
            uniProps={(theme) => ({
              size: theme.typography[2].lineHeight,
            })}
          />

          <Text numberOfLines={1} size="2" style={styles.url}>
            {url}
          </Text>
        </View>
      </Pressable>
    </LinkMenu>
  )
}

const styles = StyleSheet.create((theme) => ({
  icon: {
    ...StyleSheet.absoluteFillObject,
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
    backgroundColor: theme.colors.gray.uiActive,
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
      oled: {
        true: {
          backgroundColor: theme.colors.gray.bgAlt,
        },
      },
    },
  },
  url: {
    flex: 1,
  },
}))
