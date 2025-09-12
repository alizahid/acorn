import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHide } from '~/hooks/moderation/hide'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
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
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({ expanded, post, style, viewing }: Props) {
  const router = useRouter()

  const a11y = useTranslations('a11y')

  const {
    boldTitle,
    communityOnTop,
    dimSeen,
    feedCompact,
    fontSizePostBody,
    fontSizePostTitle,
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
        router.push({
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

  const body = Boolean(expanded) && Boolean(post.body)
  const compact = feedCompact && !expanded
  const media =
    (post.type === 'crosspost' && Boolean(post.crossPost)) ||
    (post.type === 'video' && Boolean(post.media.video)) ||
    (post.type === 'image' && Boolean(post.media.images?.length)) ||
    (post.type === 'link' && Boolean(post.url)) ||
    (expanded && post.body)

  function onPress() {
    router.push({
      params: {
        id: removePrefix(post.id),
      },
      pathname: '/posts/[id]',
    })
  }

  if (compact) {
    return (
      <PostMenu onPress={onPress} post={post}>
        <Gestures
          containerStyle={styles.container}
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
          style={[styles.main, style]}
        >
          <PostCompactCard
            expanded={expanded}
            onPress={onPress}
            post={post}
            side={mediaOnRight ? 'right' : 'left'}
            style={styles.dimmed}
            viewing={viewing}
          />
        </Gestures>
      </PostMenu>
    )
  }

  return (
    <PostMenu onPress={onPress} post={post}>
      <Gestures
        containerStyle={styles.container}
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
        style={[styles.main, style]}
      >
        <Pressable
          disabled={expanded}
          gap="2"
          hint={a11y('viewPost')}
          label={post.title}
          onPress={onPress}
          pb={media ? '3' : undefined}
          pt="3"
          px="3"
          style={styles.dimmed}
        >
          {communityOnTop ? <PostCommunity post={post} /> : null}

          <Text
            size={fontSizePostTitle}
            weight={boldTitle ? 'bold' : undefined}
          >
            {post.title}
          </Text>

          <FlairCard
            flair={post.flair}
            nsfw={post.nsfw}
            spoiler={post.spoiler}
          />
        </Pressable>

        {post.type === 'crosspost' && post.crossPost ? (
          <CrossPostCard
            post={post.crossPost}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
            viewing={viewing}
          />
        ) : null}

        {post.type === 'video' && post.media.video ? (
          <PostVideoCard
            nsfw={post.nsfw}
            recyclingKey={post.id}
            spoiler={post.spoiler}
            style={body ? styles.expanded : null}
            thumbnail={post.media.images?.[0]?.url}
            video={post.media.video}
            viewing={viewing}
          />
        ) : null}

        {post.type === 'image' && post.media.images ? (
          <PostGalleryCard
            images={post.media.images}
            nsfw={post.nsfw}
            recyclingKey={post.id}
            spoiler={post.spoiler}
            style={body ? styles.expanded : null}
            viewing={viewing}
          />
        ) : null}

        {post.type === 'link' && post.url ? (
          <PostLinkCard
            media={post.media.images?.[0]}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
            url={post.url}
          />
        ) : null}

        {expanded && post.body ? (
          <Html
            meta={post.media.meta}
            size={fontSizePostBody}
            style={styles.body}
            type="post"
          >
            {post.body}
          </Html>
        ) : null}

        <PostFooter
          community={!communityOnTop}
          expanded={expanded}
          post={post}
          style={styles.dimmed}
        />

        {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
      </Gestures>
    </PostMenu>
  )
}

const styles = StyleSheet.create((theme) => ({
  body: {
    marginHorizontal: theme.space[3],
  },
  container: {
    alignSelf: 'center',
    borderCurve: 'continuous',
    variants: {
      iPad: {
        true: {
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
  expanded: {
    marginBottom: theme.space[3],
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    compoundVariants: [
      {
        oled: true,
        sticky: true,
        styles: {
          backgroundColor: theme.colors.green.uiAlpha,
        },
      },
    ],
    overflow: 'hidden',
    variants: {
      iPad: {
        true: {
          borderRadius: theme.radius[3],
        },
      },
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
