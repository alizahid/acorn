import { type LegendListProps } from '@legendapp/list'
import { sum } from 'lodash'
import { Dimensions, type ScaledSize } from 'react-native'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { useStyles } from 'react-native-unistyles'

import { type Comment } from '~/types/comment'
import { type InboxMessage, type InboxNotification } from '~/types/inbox'
import { type Post } from '~/types/post'

type Padding =
  | number
  | {
      bottom?: number
      left?: number
      right?: number
      top?: number
    }
  | {
      horizontal?: number
      vertical?: number
    }

type Props = {
  bottom?: boolean | number
  header?: boolean
  padding?: Padding
  scroll?: boolean
  tabBar?: boolean
  top?: boolean | number
}

export type ListProps<Type = unknown> = Pick<
  LegendListProps<Type>,
  | 'contentContainerStyle'
  | 'drawDistance'
  | 'keyboardDismissMode'
  | 'keyboardShouldPersistTaps'
  | 'scrollIndicatorInsets'
> & {
  progressViewOffset?: number
}

export function useList<Type>({
  bottom = 0,
  header = true,
  padding,
  scroll = true,
  tabBar = true,
  top = 0,
}: Props = {}): ListProps<Type> {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()

  const { theme } = useStyles()

  const offsets = {
    bottom:
      (tabBar
        ? insets.bottom + theme.space[3] + theme.space[5] + theme.space[3]
        : 0) + (typeof bottom === 'number' ? bottom : 0),
    top:
      (header ? insets.top + theme.space[8] : 0) +
      (typeof top === 'number' ? top : 0),
  }

  const paddingTop =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'vertical' in padding
        ? padding.vertical
        : 'top' in padding
          ? padding.top
          : 0)

  const paddingBottom =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'vertical' in padding
        ? padding.vertical
        : 'bottom' in padding
          ? padding.bottom
          : 0)

  const paddingLeft =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'horizontal' in padding
        ? padding.horizontal
        : 'left' in padding
          ? padding.left
          : 0)

  const paddingRight =
    padding &&
    (typeof padding === 'number'
      ? padding
      : 'horizontal' in padding
        ? padding.horizontal
        : 'right' in padding
          ? padding.right
          : 0)

  return {
    contentContainerStyle: {
      flexGrow: 1,
      paddingBottom:
        offsets.bottom +
        (paddingBottom ?? 0) +
        (typeof bottom === 'boolean' ? insets.bottom : 0),
      paddingLeft,
      paddingRight,
      paddingTop:
        offsets.top +
        (paddingTop ?? 0) +
        (typeof top === 'boolean' ? insets.top : 0),
    },
    drawDistance: frame.height * 3,
    keyboardDismissMode: 'on-drag',
    keyboardShouldPersistTaps: 'handled',
    progressViewOffset: offsets.top,
    scrollIndicatorInsets: {
      bottom: offsets.bottom - (scroll ? insets.bottom : 0),
      right: 1,
      top: offsets.top - (scroll ? insets.top : 0),
    },
  }
}

type EstimateHeightProps = {
  compact?: boolean
  index: number
  large?: boolean
} & (
  | {
      item?: Post
      type: 'post'
    }
  | {
      item?: Comment
      type: 'comment'
    }
  | {
      item?: InboxNotification
      type: 'notification'
    }
  | {
      item?: InboxMessage
      type: 'message'
    }
)

export function estimateHeight({
  compact,
  item,
  large,
  type,
}: EstimateHeightProps) {
  const dimensions = Dimensions.get('screen')

  if (type === 'comment') {
    if (item?.type === 'more') {
      return 36
    }

    const lines = sum(
      item?.data.body
        .split('\n')
        .map((line) => (line.length * 9) / dimensions.width)
        .map((line) => Math.ceil(line)),
    )

    // TODO: images in comments

    return (
      12 + // padding
      lines * 20 + // body
      12 + // padding
      16 + // footer
      12 // padding
    )
  }

  if (type === 'notification') {
    const lines = sum(
      item?.body
        .split('\n')
        .map((line) => (line.length * 9) / dimensions.width)
        .map((line) => Math.ceil(line)),
    )

    return (
      16 + // padding
      24 + // subject
      8 + // padding
      lines * 20 + // body
      8 + // padding
      20 + // footer
      16 // padding
    )
  }

  if (type === 'message') {
    const lines = sum(
      item?.body
        .split('\n')
        .map((line) => (line.length * 9) / dimensions.width)
        .map((line) => Math.ceil(line)),
    )

    return (
      16 + // padding
      20 + // author
      24 + // subject
      16 + // padding
      lines * 24 + // body
      16 + // padding
      20 + // padding
      16 // padding
    )
  }

  const lines = sum(
    item?.title
      .split('\n')
      .map((line) => (line.length * 9) / dimensions.width)
      .map((line) => Math.ceil(line)),
  )

  if (compact) {
    const content =
      20 + // community
      12 + // padding
      lines * 24 + // title
      12 + // padding
      16 // footer

    return (
      12 + // padding
      (large ? Math.max(content, 48) : content) + // content
      12 // padding
    )
  }

  return (
    12 + // padding
    lines * 24 + // title
    12 + // padding
    getMediaHeight(dimensions, item) + // media
    12 + // padding
    68 + // footer
    12 // padding
  )
}

function getMediaHeight(
  dimensions: ScaledSize,
  post?: Post,
  crossPost?: boolean,
): number {
  if (!post) {
    return 0
  }

  const width = dimensions.width - (crossPost ? 24 : 0)

  if (post.type === 'crosspost' && post.crossPost) {
    const lines = sum(
      post.crossPost.title
        .split('\n')
        .map((line) => (line.length * 9) / width)
        .map((line) => Math.ceil(line)),
    )

    const content =
      (post.crossPost.type === 'video' && post.media.video) ??
      (post.crossPost.type === 'image' && post.media.images) ??
      (post.crossPost.type === 'link' && post.url)

    return (
      12 + // padding
      (content ? 12 : 0) + // padding
      getMediaHeight(dimensions, post.crossPost, true) + // media
      lines * 20 + // title
      12 + // padding
      16 + // footer
      12 // padding
    )
  }

  if (post.type === 'video' && post.media.video) {
    const height = (post.media.video.height / post.media.video.width) * width

    return Math.min(height, dimensions.height * 0.6)
  }

  if (post.type === 'image' && post.media.images) {
    if (post.media.images.length === 1) {
      if (!post.media.images[0]) {
        return 0
      }

      const height =
        (post.media.images[0].height / post.media.images[0].width) * width

      return Math.min(height, dimensions.height * 0.6)
    }

    if (post.media.images.length > 2) {
      return width
    }

    return width / 2
  }

  if (post.type === 'link' && post.url) {
    return (
      (post.media.images?.[0] ? (width - (crossPost ? 24 : 0)) / 2 : 0) + // image
      44 // footer
    )
  }

  return 0
}
