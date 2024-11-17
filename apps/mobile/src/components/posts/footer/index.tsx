import { useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { PostMenu } from '../menu'
import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  expanded?: boolean
  gestures?: boolean
  label?: PostLabel
  post: Post
  seen?: boolean
}

export function PostFooter({ expanded, gestures, label, post, seen }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  const { vote } = usePostVote()

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={expanded}
      gap="4"
      justify="between"
      onPress={(event) => {
        if (event.target !== event.currentTarget) {
          event.preventDefault()

          return
        }

        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      p="3"
    >
      <View align="start" flexShrink={1} gap="2">
        <PostCommunity label={label} post={post} seen={seen} />

        <PostMeta post={post} seen={seen} />
      </View>

      <View align="center" direction={gestures ? 'row' : 'row-reverse'} gap="4">
        <PostMenu post={post}>
          <FooterButton
            color={theme.colors.gray[seen ? 'a11' : 'a12']}
            icon="DotsThree"
            onPress={(event) => {
              event.stopPropagation()
            }}
            weight="bold"
          />
        </PostMenu>

        {gestures ? (
          <FooterButton
            color={theme.colors.gray[seen ? 'a11' : 'a12']}
            icon="Export"
            onPress={() => {
              const url = new URL(post.permalink, 'https://reddit.com')

              void Sharing.shareAsync(url.toString())
            }}
          />
        ) : (
          <FooterButton
            color={
              post.liked
                ? theme.colors.orange.a9
                : theme.colors.gray[seen ? 'a11' : 'a12']
            }
            fill={Boolean(post.liked)}
            icon="ArrowUp"
            onPress={() => {
              vote({
                direction: post.liked ? 0 : 1,
                postId: post.id,
              })
            }}
            weight="bold"
          />
        )}
      </View>

      {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  saved: {
    backgroundColor: theme.colors.green[9],
    bottom: -theme.space[iPad ? 5 : 4],
    height: theme.space[iPad ? 8 : 6],
    position: 'absolute',
    right: -theme.space[iPad ? 5 : 4],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[iPad ? 8 : 6],
  },
}))
