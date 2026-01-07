import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Share } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHide } from '~/hooks/moderation/hide'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { cardMaxWidth, iPad } from '~/lib/common'
import { useGestures } from '~/stores/gestures'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'
import { type Post } from '~/types/post'

import { type GestureAction, Gestures } from '../common/gestures'
import { Html } from '../common/html'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostCompactCard } from './compact'
import { CrossPostCard } from './crosspost'
import { FlairCard } from './flair'
import { PostFooter } from './footer'
import { PostCommunity } from './footer/community'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostMenu } from './menu'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  post: Post
}

export function PostCard({ expanded, post }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const {
    boldTitle,
    communityOnTop,
    dimSeen,
    feedCompact,
    fontSizeTitle,
    mediaOnRight,
    oldReddit,
    themeOled,
  } = usePreferences()
  const {
    postLeft,
    postLeftLong,
    postLeftShort,
    postRight,
    postRightLong,
    postRightShort,
  } = useGestures()

  const dimmed = !expanded && dimSeen && post.seen

  styles.useVariants({
    dimmed,
    iPad,
    oled: themeOled,
    sticky: post.sticky,
  })

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { hide } = useHide()

  const onAction = useCallback(
    (item: Post, action?: GestureAction) => {
      if (!action) {
        return
      }

      if (action === 'upvote') {
        vote({
          direction: item.liked ? 0 : 1,
          postId: item.id,
        })
      }

      if (action === 'downvote') {
        vote({
          direction: item.liked === false ? 0 : -1,
          postId: item.id,
        })
      }

      if (action === 'save') {
        save({
          action: item.saved ? 'unsave' : 'save',
          postId: item.id,
        })
      }

      if (action === 'reply') {
        router.navigate({
          params: {
            id: item.id,
          },
          pathname: '/posts/[id]/reply',
        })
      }

      if (action === 'share') {
        const url = new URL(
          post.permalink,
          oldReddit ? 'https://old.reddit.com' : 'https://www.reddit.com',
        )

        Share.share({
          url: url.toString(),
        })
      }

      if (action === 'hide') {
        hide({
          action: post.hidden ? 'unhide' : 'hide',
          id: post.id,
          type: 'post',
        })
      }
    },
    [hide, oldReddit, post.hidden, post.id, post.permalink, router, save, vote],
  )

  if (feedCompact && !expanded) {
    return (
      <Gestures
        data={post}
        left={{
          enabled: postLeft,
          long: postLeftLong,
          short: postLeftShort,
        }}
        onAction={(action) => {
          onAction(post, action)
        }}
        right={{
          enabled: postRight,
          long: postRightLong,
          short: postRightShort,
        }}
        style={styles.container}
      >
        <PostMenu post={post}>
          <Pressable
            accessibilityHint={a11y('viewPost')}
            accessibilityLabel={post.title}
            disabled={expanded}
          >
            <View style={styles.main}>
              <PostCompactCard
                post={post}
                side={mediaOnRight ? 'right' : 'left'}
                style={styles.dimmed}
              />
            </View>
          </Pressable>
        </PostMenu>
      </Gestures>
    )
  }

  return (
    <Gestures
      data={post}
      left={{
        enabled: postLeft,
        long: postLeftLong,
        short: postLeftShort,
      }}
      onAction={(action) => {
        onAction(post, action)
      }}
      right={{
        enabled: postRight,
        long: postRightLong,
        short: postRightShort,
      }}
      style={styles.container}
    >
      <PostMenu post={post}>
        <Pressable
          accessibilityHint={a11y('viewPost')}
          accessibilityLabel={post.title}
          disabled={expanded}
        >
          <View style={styles.main}>
            <View gap="1" style={styles.dimmed}>
              {communityOnTop ? <PostCommunity post={post} /> : null}

              <Text
                size={fontSizeTitle}
                weight={boldTitle ? 'bold' : undefined}
              >
                {post.title}
              </Text>

              <FlairCard
                flair={post.flair}
                nsfw={post.nsfw}
                spoiler={post.spoiler}
              />
            </View>

            {post.type === 'crosspost' && post.crossPost ? (
              <CrossPostCard post={post.crossPost} recyclingKey={post.id} />
            ) : null}

            {post.type === 'video' && post.media.video ? (
              <PostVideoCard
                nsfw={post.nsfw}
                recyclingKey={post.id}
                spoiler={post.spoiler}
                thumbnail={post.media.images?.[0]?.url}
                video={post.media.video}
              />
            ) : null}

            {post.type === 'image' && post.media.images ? (
              <PostGalleryCard
                images={post.media.images}
                nsfw={post.nsfw}
                recyclingKey={post.id}
                spoiler={post.spoiler}
              />
            ) : null}

            {post.type === 'link' && post.url ? (
              <View>
                <PostLinkCard
                  media={post.media.images?.[0]}
                  recyclingKey={post.id}
                  url={post.url}
                />
              </View>
            ) : null}

            {expanded && post.body ? (
              <Html meta={post.media.meta} type="post">
                {post.body}
              </Html>
            ) : null}

            <PostFooter
              community={!communityOnTop}
              post={post}
              style={styles.dimmed}
            />

            {post.saved ? (
              <View pointerEvents="none" style={styles.saved} />
            ) : null}
          </View>
        </Pressable>
      </PostMenu>
    </Gestures>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    overflow: 'hidden',
    variants: {
      iPad: {
        true: {
          alignSelf: 'center',
          borderCurve: 'continuous',
          borderRadius: theme.radius[4],
          maxWidth: cardMaxWidth,
        },
      },
    },
    width: '100%',
  },
  dimmed: {
    variants: {
      dimmed: {
        true: {
          opacity: 0.5,
        },
      },
    },
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    compoundVariants: [
      {
        oled: true,
        sticky: true,
        styles: {
          backgroundColor: theme.colors.green.uiAlpha,
        },
      },
    ],
    gap: theme.space[3],
    padding: theme.space[3],
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      sticky: {
        true: {
          backgroundColor: theme.colors.green.ui,
        },
      },
    },
  },
  saved: {
    backgroundColor: theme.colors.green.accent,
    height: theme.space[8],
    position: 'absolute',
    right: -theme.space[6],
    top: -theme.space[6],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[8],
  },
}))
