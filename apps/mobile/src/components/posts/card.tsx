import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { usePreferences } from '~/stores/preferences'
import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostCompactCard } from './compact'
import { CrossPostCard } from './crosspost'
import { FlairCard } from './flair'
import { PostFooter, type PostLabel } from './footer'
import { PostGalleryCard } from './gallery'
import { type GestureAction, PostGestures } from './gestures'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  expanded?: boolean
  label?: PostLabel
  post: Post
  reverse?: boolean
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  compact,
  expanded,
  label,
  post,
  reverse,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const { dimSeen } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const { vote } = usePostVote()
  const { save } = usePostSave()

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
    },
    [router, save, vote],
  )

  const body = Boolean(expanded) && Boolean(post.body)
  const seen = dimSeen && post.seen && !expanded

  if (compact) {
    return (
      <PostGestures
        containerStyle={styles.container}
        liked={post.liked}
        onAction={(action) => {
          onAction(post, action)
        }}
        saved={post.saved}
        style={[styles.main(seen), style]}
      >
        <PostCompactCard
          expanded={expanded}
          label={label}
          post={post}
          reverse={reverse}
          seen={seen}
        />
      </PostGestures>
    )
  }

  return (
    <PostGestures
      containerStyle={styles.container}
      liked={post.liked}
      onAction={(action) => {
        onAction(post, action)
      }}
      saved={post.saved}
      style={[styles.main(seen), style]}
    >
      <Pressable
        align="start"
        disabled={expanded}
        gap="2"
        onPress={() => {
          router.navigate({
            params: {
              id: removePrefix(post.id),
            },
            pathname: '/posts/[id]',
          })
        }}
        p="3"
      >
        <Text highContrast={!seen} weight="bold">
          {post.title}
        </Text>

        <FlairCard flair={post.flair} seen={seen} />
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
          compact={compact}
          nsfw={post.nsfw}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
          video={post.media.video}
          viewing={viewing}
        />
      ) : null}

      {post.type === 'image' && post.media.images ? (
        <PostGalleryCard
          compact={compact}
          images={post.media.images}
          nsfw={post.nsfw}
          recyclingKey={post.id}
          style={body ? styles.expanded : null}
        />
      ) : null}

      {post.type === 'link' && post.url ? (
        <PostLinkCard
          compact={compact}
          media={post.media.images?.[0]}
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

      <PostFooter expanded={expanded} label={label} post={post} seen={seen} />
    </PostGestures>
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
  main: (seen: boolean) => ({
    backgroundColor: theme.colors.gray[seen ? 2 : 3],
    borderCurve: 'continuous',
    borderRadius: iPad ? theme.radius[3] : undefined,
  }),
}))
