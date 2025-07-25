import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
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

  const { styles, theme } = useStyles(stylesheet)

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
        style={styles.compact(large)}
      >
        {post.media.images?.[0] ? (
          <Image
            accessibilityIgnoresInvertColors
            source={post.media.images[0].thumbnail}
            style={styles.compactImage}
          />
        ) : null}

        <View align="center" justify="center" style={styles.compactIcon}>
          <Icon
            color={theme.colors.accent.accent}
            name="ArrowsSplit"
            style={styles.crossPost}
          />
        </View>
      </Pressable>
    )
  }

  const footer = [
    {
      icon: 'ArrowFatUp',
      key: 'votes',
      label: f.number(post.votes, {
        notation: 'compact',
      }),
    },
    {
      icon: 'ChatCircle',
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
      style={[styles.main(themeOled), style]}
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
            hitSlop={theme.space[4]}
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
              color={theme.colors.accent.accent}
              name="ArrowsSplit"
              size={theme.typography[1].lineHeight}
              style={styles.crossPost}
            />

            <Text size="1" weight="medium">
              {post.community.name}
            </Text>
          </Pressable>

          {footer.map((item) => (
            <View align="center" direction="row" gap="1" key={item.key}>
              <Icon
                color={theme.colors.gray.textLow}
                name={item.icon}
                size={theme.typography[1].lineHeight}
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

const stylesheet = createStyleSheet((theme) => ({
  compact: (large?: boolean) => ({
    backgroundColor: theme.colors.gray.uiActive,
    borderCurve: 'continuous',
    borderRadius: theme.space[large ? 2 : 1],
    height: theme.space[8] * (large ? 2 : 1),
    overflow: 'hidden',
    width: theme.space[8] * (large ? 2 : 1),
  }),
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
  main: (oled: boolean) => ({
    backgroundColor: theme.colors.gray[oled ? 'bg' : 'uiHover'],
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    overflow: 'hidden',
  }),
}))
