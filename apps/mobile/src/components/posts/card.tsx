import { useRouter } from 'expo-router'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import BookmarkSimpleIcon from 'react-native-phosphor/src/duotone/BookmarkSimple'
import ChatCircleTextIcon from 'react-native-phosphor/src/duotone/ChatCircleText'
import ClockIcon from 'react-native-phosphor/src/duotone/Clock'
import ShareFatIcon from 'react-native-phosphor/src/duotone/ShareFat'
import BookmarkSimpleFillIcon from 'react-native-phosphor/src/fill/BookmarkSimple'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'

import { usePostSave } from '~/hooks/mutations/posts/save'
import { type FeedType } from '~/hooks/queries/posts/posts'
import { type Post } from '~/types/post'

import { Markdown } from '../common/markdown'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { PostImages } from './images'
import { PostVideo } from './video'
import { PostVote } from './vote'

type Props = {
  body?: boolean
  feedType?: FeedType
  linkable?: boolean
  margin?: number
  post: Post
  style?: StyleProp<ViewStyle>
  viewing: boolean
}

export function PostCard({
  body,
  feedType,
  linkable = true,
  margin = 0,
  post,
  style,
  viewing,
}: Props) {
  const router = useRouter()

  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { save } = usePostSave()

  const footer = [
    {
      Icon: ChatCircleTextIcon,
      disabled: !linkable,
      key: 'comments',
      label: f.number(post.comments, {
        notation: 'compact',
      }),
      onPress: () => {
        router.navigate(`/posts/${post.id}`)
      },
    },
    {
      Icon: ClockIcon,
      key: 'created',
      label: f.relativeTime(post.createdAt, {
        style: 'narrow',
      }),
    },
    'separator-1',
    {
      Icon: post.saved ? BookmarkSimpleFillIcon : BookmarkSimpleIcon,
      color: post.saved ? theme.colors.accentA[9] : undefined,
      key: 'save',
      onPress: () => {
        save({
          action: post.saved ? 'unsave' : 'save',
          feedType,
          postId: post.id,
        })
      },
    },
    {
      Icon: ShareFatIcon,
      key: 'share',
      onPress: () => null,
    },
  ]

  return (
    <View style={style}>
      <View style={styles.header}>
        <Pressable>
          <Text highContrast={false} size="1" weight="medium">
            r/{post.subreddit}
          </Text>
        </Pressable>

        <Pressable
          disabled={!linkable}
          onPress={() => {
            router.navigate(`/posts/${post.id}`)
          }}
        >
          <Text highContrast={!post.read} weight="bold">
            {post.title}
          </Text>
        </Pressable>
      </View>

      {post.media.video ? (
        <PostVideo
          key={post.id}
          margin={margin}
          video={post.media.video}
          viewing={viewing}
        />
      ) : post.media.images ? (
        <PostImages images={post.media.images} key={post.id} margin={margin} />
      ) : null}

      {body && post.body ? (
        <View style={styles.body}>
          <Markdown margin={margin + theme.space[2]} meta={post.media.meta}>
            {post.body}
          </Markdown>
        </View>
      ) : null}

      <View style={styles.footer}>
        <PostVote feedType={feedType} post={post} />

        {footer.map((item) => {
          if (typeof item === 'string') {
            return <View key={item} style={styles.separator} />
          }

          return (
            <Pressable
              disabled={!item.onPress || item.disabled}
              hitSlop={theme.space[4]}
              key={item.key}
              onPress={item.onPress}
              style={styles.action}
            >
              <item.Icon
                color={item.color ?? theme.colors.grayA[post.read ? 11 : 11]}
                size={theme.typography[2].lineHeight}
              />

              {item.label !== undefined ? (
                <Text highContrast={!post.read} size="2" tabular>
                  {item.label}
                </Text>
              ) : null}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  },
  body: {
    paddingHorizontal: theme.space[2],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
    padding: theme.space[2],
  },
  header: {
    gap: theme.space[1],
    padding: theme.space[2],
  },
  separator: {
    flex: 1,
  },
}))
