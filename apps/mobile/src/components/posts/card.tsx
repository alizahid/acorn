import { type BottomSheetModal } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useCallback, useRef } from 'react'
import { Share, type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useHide } from '~/hooks/moderation/hide'
import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { type GestureAction, PostGestures } from '../common/gestures'
import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostCompactCard } from './compact'
import { CrossPostCard } from './crosspost'
import { PostFooter, type PostLabel } from './footer'
import { PostGalleryCard } from './gallery'
import { PostLinkCard } from './link'
import { PostMenu } from './menu'
import { PostVideoCard } from './video'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({ expanded, label, post, style, viewing }: Props) {
  const router = useRouter()

  const {
    dimSeen,
    feedCompact,
    mediaOnRight,
    oldReddit,
    postGestures,
    swipeGestures,
    themeOled,
  } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const menu = useRef<BottomSheetModal>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()
  const { hide } = useHide()

  const onAction = useCallback(
    (item: Post, action: GestureAction) => {
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
          oldReddit ? 'https://old.reddit.com' : 'https://reddit.com',
        )

        void Share.share({
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
  const seen = dimSeen && post.seen && !expanded
  const media =
    (post.type === 'crosspost' && Boolean(post.crossPost)) ||
    (post.type === 'video' && Boolean(post.media.video)) ||
    (post.type === 'image' && Boolean(post.media.images?.length)) ||
    (post.type === 'link' && Boolean(post.url)) ||
    (expanded && post.body)

  function onPress() {
    router.navigate({
      params: {
        id: removePrefix(post.id),
      },
      pathname: '/posts/[id]',
    })
  }

  if (compact) {
    return (
      <>
        <PostGestures
          containerStyle={styles.container}
          data={post}
          disabled={!swipeGestures}
          gestures={postGestures}
          onAction={(action) => {
            onAction(post, action)
          }}
          style={[styles.main(seen, themeOled), style]}
        >
          <PostCompactCard
            expanded={expanded}
            label={label}
            onLongPress={() => {
              menu.current?.present()
            }}
            onPress={onPress}
            post={post}
            seen={seen}
            side={mediaOnRight ? 'right' : 'left'}
          />
        </PostGestures>

        <PostMenu
          onClose={() => {
            menu.current?.close()
          }}
          post={post}
          ref={menu}
        />
      </>
    )
  }

  return (
    <>
      <PostGestures
        containerStyle={styles.container}
        data={post}
        disabled={!swipeGestures}
        gestures={postGestures}
        onAction={(action) => {
          onAction(post, action)
        }}
        style={[styles.main(seen, themeOled), style]}
      >
        <Pressable
          align="start"
          disabled={expanded}
          gap="3"
          onLongPress={() => {
            menu.current?.present()
          }}
          onPress={onPress}
          pb={media ? '3' : undefined}
          pt="3"
          px="3"
        >
          <Text highContrast={!seen} weight="bold">
            {post.title}
          </Text>
        </Pressable>

        {post.type === 'crosspost' && post.crossPost ? (
          <CrossPostCard
            onLongPress={() => {
              menu.current?.present()
            }}
            post={post.crossPost}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
            viewing={viewing}
          />
        ) : null}

        {post.type === 'video' && post.media.video ? (
          <PostVideoCard
            nsfw={post.nsfw}
            onLongPress={() => {
              menu.current?.present()
            }}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
            video={post.media.video}
            viewing={viewing}
          />
        ) : null}

        {post.type === 'image' && post.media.images ? (
          <PostGalleryCard
            images={post.media.images}
            nsfw={post.nsfw}
            onLongPress={() => {
              menu.current?.present()
            }}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
          />
        ) : null}

        {post.type === 'link' && post.url ? (
          <PostLinkCard
            media={post.media.images?.[0]}
            onLongPress={() => {
              menu.current?.present()
            }}
            recyclingKey={post.id}
            style={body ? styles.expanded : null}
            url={post.url}
          />
        ) : null}

        {expanded && post.body ? (
          <Markdown
            meta={post.media.meta}
            recyclingKey={post.id}
            size="2"
            style={styles.body}
            variant="post"
          >
            {post.body}
          </Markdown>
        ) : null}

        <PostFooter
          expanded={expanded}
          label={label}
          onLongPress={() => {
            menu.current?.present()
          }}
          post={post}
          seen={seen}
        />

        {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
      </PostGestures>

      <PostMenu
        onClose={() => {
          menu.current?.close()
        }}
        post={post}
        ref={menu}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginHorizontal: theme.space[3],
  },
  container: {
    alignSelf: 'center',
    borderCurve: 'continuous',
    borderRadius: iPad ? theme.radius[4] : undefined,
    maxWidth: iPad ? cardMaxWidth : undefined,
    width: '100%',
  },
  expanded: {
    marginBottom: theme.space[3],
  },
  main: (seen: boolean, oled: boolean) => ({
    backgroundColor: theme.colors.gray[oled ? 'bg' : seen ? 'bgAlt' : 'ui'],
    borderCurve: 'continuous',
    borderRadius: iPad ? theme.radius[3] : undefined,
    overflow: 'hidden',
  }),
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
