import { useRouter } from 'expo-router'
import { type ReactNode, useRef } from 'react'
import Swipeable, {
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useSharedValue } from 'react-native-reanimated'

import { usePostSave } from '~/hooks/mutations/posts/save'
import { usePostVote } from '~/hooks/mutations/posts/vote'
import { type Post } from '~/types/post'

import { Left } from './left'
import { Right } from './right'

export type Action = 'upvote' | 'downvote' | 'save' | 'reply' | undefined

type Props = {
  children: ReactNode
  disabled?: boolean
  post: Post
}

export function PostGestures({ children, disabled, post }: Props) {
  const router = useRouter()

  const swipeable = useRef<SwipeableMethods>(null)

  const { vote } = usePostVote()
  const { save } = usePostSave()

  const action = useSharedValue<Action>(undefined)

  if (disabled) {
    return children
  }

  return (
    <Swipeable
      leftThreshold={Infinity}
      onSwipeableWillClose={() => {
        const next = action.get()

        if (next === 'upvote') {
          vote({
            direction: post.liked ? 0 : 1,
            postId: post.id,
          })
        }

        if (next === 'downvote') {
          vote({
            direction: post.liked === false ? 0 : -1,
            postId: post.id,
          })
        }

        if (next === 'save') {
          save({
            action: post.saved ? 'unsave' : 'save',
            postId: post.id,
          })
        }

        if (next === 'reply') {
          router.navigate({
            params: {
              id: post.id,
            },
            pathname: '/posts/[id]/reply',
          })
        }
      }}
      onSwipeableWillOpen={() => {
        swipeable.current?.close()
      }}
      ref={swipeable}
      renderLeftActions={(progress) => (
        <Left action={action} post={post} progress={progress} />
      )}
      renderRightActions={(progress) => (
        <Right action={action} post={post} progress={progress} />
      )}
      rightThreshold={Infinity}
    >
      {children}
    </Swipeable>
  )
}
