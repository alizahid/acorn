import { useRouter } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { Share, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useHide } from '~/hooks/moderation/hide'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { REDDIT_OLD_URI, REDDIT_URI } from '~/reddit/api'
import { useGestures } from '~/stores/gestures'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Banner } from '../common/banner'
import { type GestureAction, Gestures } from '../common/gestures'
import { Pressable } from '../common/pressable'
import { type Sheet } from '../common/sheet'
import { Text } from '../common/text'
import { Markdown } from '../markdown'
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
    privateScreenshots,
  } = usePreferences((state) => ({
    boldTitle: state.boldTitle,
    communityOnTop: state.communityOnTop,
    dimSeen: state.dimSeen,
    feedCompact: state.feedCompact,
    fontSizeTitle: state.fontSizeTitle,
    mediaOnRight: state.mediaOnRight,
    oldReddit: state.oldReddit,
    privateScreenshots: state.privateScreenshots,
  }))

  const {
    postLeft,
    postLeftLong,
    postLeftShort,
    postRight,
    postRightLong,
    postRightShort,
  } = useGestures((state) => ({
    postLeft: state.postLeft,
    postLeftLong: state.postLeftLong,
    postLeftShort: state.postLeftShort,
    postRight: state.postRight,
    postRightLong: state.postRightLong,
    postRightShort: state.postRightShort,
  }))

  const card = useRef<View>(null)
  const menu = useRef<Sheet>(null)

  const [capturing, setCapturing] = useState(false)

  const dimmed = !expanded && dimSeen && post.seen

  styles.useVariants({
    compact: feedCompact && !expanded,
    dimmed,
    iPad,
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
          oldReddit ? REDDIT_OLD_URI : REDDIT_URI,
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

  function onPress() {
    if (expanded) {
      return
    }

    router.navigate({
      params: {
        id: removePrefix(post.id),
      },
      pathname: '/posts/[id]',
    })
  }

  function onLongPress() {
    menu.current?.present()
  }

  const privacy = privateScreenshots && capturing

  if (feedCompact && !expanded) {
    return (
      <Gestures
        data={{
          hidden: post.hidden,
          liked: post.liked,
          saved: post.saved,
        }}
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
        <PostMenu card={card} onCapturing={setCapturing} post={post} ref={menu}>
          <Pressable
            accessibilityHint={a11y('viewPost')}
            accessibilityLabel={post.title}
            onLongPress={onLongPress}
            onPress={onPress}
          >
            <View collapsable={false} ref={card} style={styles.compact}>
              <PostCompactCard
                post={post}
                privacy={privacy}
                side={mediaOnRight ? 'right' : 'left'}
                style={styles.dimmed}
              />

              {capturing ? <Banner style={styles.banner} /> : null}
            </View>
          </Pressable>
        </PostMenu>
      </Gestures>
    )
  }

  return (
    <Gestures
      data={{
        hidden: post.hidden,
        liked: post.liked,
        saved: post.saved,
      }}
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
      <PostMenu card={card} onCapturing={setCapturing} post={post} ref={menu}>
        <Pressable
          accessibilityHint={a11y('viewPost')}
          accessibilityLabel={post.title}
          onLongPress={onLongPress}
          onPress={onPress}
        >
          <View collapsable={false} ref={card} style={styles.main}>
            <View style={[styles.header, styles.dimmed]}>
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
              <CrossPostCard
                onLongPress={onLongPress}
                post={post.crossPost}
                recyclingKey={post.id}
              />
            ) : null}

            {post.type === 'video' && post.media.video ? (
              <PostVideoCard
                nsfw={post.nsfw}
                onLongPress={onLongPress}
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
                onLongPress={onLongPress}
                recyclingKey={post.id}
                spoiler={post.spoiler}
              />
            ) : null}

            {post.type === 'link' && post.url ? (
              <PostLinkCard
                media={post.media.images?.[0]}
                onLongPress={onLongPress}
                recyclingKey={post.id}
                url={post.url}
              />
            ) : null}

            {expanded && post.body ? (
              <Markdown meta={post.media.meta}>{post.body}</Markdown>
            ) : null}

            <PostFooter
              community={!communityOnTop}
              post={post}
              privacy={privacy}
              style={styles.dimmed}
            />

            {capturing ? <Banner style={styles.banner} /> : null}

            {!privacy && post.saved ? (
              <View pointerEvents="none" style={styles.saved} />
            ) : null}
          </View>
        </Pressable>
      </PostMenu>
    </Gestures>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  banner: {
    variants: {
      compact: {
        false: {
          marginBottom: -theme.space[3],
          marginHorizontal: -theme.space[3],
        },
        true: {},
      },
    },
  },
  compact: {
    backgroundColor: theme.colors.ui.bg,
  },
  container: {
    alignSelf: 'center',
    overflow: 'hidden',
    variants: {
      iPad: {
        false: {
          maxWidth: runtime.screen.width,
        },
        true: {
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
  header: {
    gap: theme.space[1],
  },
  main: {
    backgroundColor: theme.colors.ui.bg,
    gap: theme.space[3],
    overflow: 'hidden',
    padding: theme.space[3],
    variants: {
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
