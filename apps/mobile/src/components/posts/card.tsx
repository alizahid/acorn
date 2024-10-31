import { useRouter } from 'expo-router'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'
import { PostCompactCard } from './compact'
import { CrossPostCard } from './crosspost'
import { FlairCard } from './flair'
import { PostFooterCard, type PostLabel } from './footer'
import { PostGalleryCard } from './gallery'
import { PostGestures } from './gestures'
import { PostLinkCard } from './link'
import { PostVideoCard } from './video'

type Props = {
  compact?: boolean
  expanded?: boolean
  label?: PostLabel
  post: Post
  reverse?: boolean
  seen?: boolean
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  compact,
  expanded,
  label,
  post,
  reverse,
  seen,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const { styles } = useStyles(stylesheet)

  const body = expanded && post.body

  if (compact) {
    return (
      <PostGestures post={post}>
        <View style={[styles.main(seen), style]}>
          <PostCompactCard
            expanded={expanded}
            label={label}
            post={post}
            reverse={reverse}
            seen={seen}
          />
        </View>
      </PostGestures>
    )
  }

  return (
    <PostGestures disabled={expanded} post={post}>
      <View style={[styles.main(seen), style]}>
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

        <PostFooterCard
          expanded={expanded}
          label={label}
          post={post}
          seen={seen}
        />
      </View>
    </PostGestures>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  body: {
    marginHorizontal: theme.space[3],
  },
  expanded: {
    marginBottom: theme.space[3],
  },
  main: (seen?: boolean) => ({
    alignSelf: 'center',
    backgroundColor: theme.colors.gray[seen ? 2 : 3],
    borderCurve: 'continuous',
    borderRadius: iPad ? theme.radius[3] : undefined,
    maxWidth: iPad ? cardMaxWidth : undefined,
    width: '100%',
  }),
}))
