import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { space } from '~/styles/tokens'
import { type Post } from '~/types/post'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  large?: boolean
  post: Post
  recyclingKey?: string
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function CrossPostCard({
  compact,
  large,
  post,
  recyclingKey,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')
  const f = useFormatter()

  const { themeOled } = usePreferences()

  styles.useVariants({
    large,
    oled: themeOled,
  })

  if (compact) {
    return (
      <Pressable
        hint={a11y('viewPost')}
        label={post.title}
        onPress={() => {
          router.push({
            params: {
              id: removePrefix(post.id),
            },
            pathname: '/posts/[id]',
          })
        }}
        style={styles.compact}
      >
        {post.media.images?.[0] ? (
          <Image
            accessibilityIgnoresInvertColors
            source={post.media.images[0].thumbnail}
            style={styles.compactImage}
          />
        ) : null}

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon name="arrow.trianglehead.branch" style={styles.crossPost} />
        </View>
      </Pressable>
    )
  }

  const footer = [
    {
      icon: 'arrowshape.up',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'bubble',
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
    },
  ] as const

  return (
    <Pressable
      hint={a11y('viewPost')}
      label={post.title}
      mx="3"
      onPress={() => {
        router.push({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      style={[styles.main, style]}
    >
      {post.type === 'video' && post.media.video ? (
        <PostVideoCard
          crossPost
          nsfw={post.nsfw}
          recyclingKey={recyclingKey}
          spoiler={post.spoiler}
          thumbnail={post.media.images?.[0]?.url}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          images={post.media.images}
          nsfw={post.nsfw}
          recyclingKey={recyclingKey}
          spoiler={post.spoiler}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          crossPost
          media={post.media.images?.[0]}
          recyclingKey={recyclingKey}
          url={post.url}
        />
      ) : null}

      <View gap="3" p="3">
        <Text lines={2} size="2" weight="medium">
          {post.title}
        </Text>

        <View align="center" direction="row" gap="4">
          <Pressable
            align="center"
            direction="row"
            gap="2"
            hint={a11y('viewCommunity')}
            hitSlop={space[4]}
            label={post.community.name}
            onPress={() => {
              router.push({
                params: {
                  name: post.community.name,
                },
                pathname: '/communities/[name]',
              })
            }}
          >
            <Icon
              name="arrow.trianglehead.branch"
              style={styles.crossPost}
              uniProps={(theme) => ({
                size: theme.typography[1].lineHeight,
              })}
            />

            <Text size="1" weight="medium">
              {post.community.name}
            </Text>
          </Pressable>

          {footer.map((item) => (
            <View align="center" direction="row" gap="1" key={item.key}>
              <Icon
                name={item.icon}
                uniProps={(theme) => ({
                  size: theme.typography[1].lineHeight,
                  tintColor: theme.colors.gray.textLow,
                })}
              />

              <Text highContrast={false} size="1" tabular>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  compact: {
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
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
  compactIcon: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.accentAlpha,
  },
  compactImage: {
    flex: 1,
  },
  crossPost: {
    transform: [
      {
        rotate: '-90deg',
      },
    ],
  },
  main: {
    backgroundColor: theme.colors.gray.uiHover,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
    variants: {
      oled: {
        true: {
          backgroundColor: theme.colors.gray.bg,
        },
      },
    },
  },
}))
