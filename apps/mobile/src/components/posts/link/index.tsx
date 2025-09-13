import { Image } from 'expo-image'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
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
  style?: StyleProp<ViewStyle>
  url: string
}

export function PostLinkCard({
  compact,
  crossPost,
  large,
  media,
  recyclingKey,
  style,
  url,
}: Props) {
  const a11y = useTranslations('a11y')

  const { seenOnMedia, themeOled } = usePreferences()
  const { handleLink } = useLink()
  const { addPost } = useHistory()

  styles.useVariants({
    crossPost,
    large,
    oled: themeOled,
  })

  const placeholder = useImagePlaceholder()

  if (compact) {
    return (
      <LinkMenu url={url}>
        <Pressable
          label={a11y('viewLink')}
          onPress={() => {
            handleLink(url)

            if (recyclingKey && seenOnMedia) {
              addPost({
                id: recyclingKey,
              })
            }
          }}
          style={styles.compact}
        >
          {media?.thumbnail ? (
            <Image
              accessibilityIgnoresInvertColors
              source={media.thumbnail}
              style={styles.compactImage}
            />
          ) : null}

          <View align="center" justify="center" style={styles.compactIcon}>
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
        label={a11y('viewLink')}
        mx="3"
        onPress={() => {
          handleLink(url)

          if (recyclingKey && seenOnMedia) {
            addPost({
              id: recyclingKey,
            })
          }
        }}
        style={[styles.main, style]}
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

        <View align="center" direction="row" gap="3" p="3">
          <Icon
            name="safari"
            uniProps={(theme) => ({
              size: theme.typography[2].lineHeight,
            })}
          />

          <Text lines={1} size="2" style={styles.url}>
            {url}
          </Text>
        </View>
      </Pressable>
    </LinkMenu>
  )
}

const styles = StyleSheet.create((theme) => ({
  compact: {
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    borderRadius: theme.space[1],
    height: theme.space[8],
    overflow: 'hidden',
    variants: {
      large: {
        true: {
          borderRadius: theme.space[2],
          height: theme.space[8] * 2,
          width: theme.space[8] * 2,
        },
      },
    },
    width: theme.space[8],
  },
  compactIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  image: {
    aspectRatio: 2,
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
