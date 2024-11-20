import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { cardMaxWidth, iPad } from '~/lib/common'
import { type CommentSort } from '~/types/sort'

import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'
import { SortIntervalMenu } from './sort-interval'

type Props = {
  commentId?: string
  onChangeSort: (sort: CommentSort) => void
  onPress?: (commentId?: string) => void
  parentId?: string
  sort: CommentSort
  sticky?: boolean
}

export function PostHeader({
  commentId,
  onChangeSort,
  onPress,
  parentId,
  sort,
  sticky,
}: Props) {
  const { styles } = useStyles(stylesheet)

  return (
    <View
      align="center"
      direction="row"
      justify={commentId ? 'between' : 'end'}
      style={styles.main(Boolean(sticky))}
    >
      {commentId ? (
        <View direction="row">
          <HeaderButton
            color="accent"
            icon="ArrowArcLeft"
            onPress={() => {
              onPress?.()
            }}
            style={styles.button}
          />

          <HeaderButton
            color="accent"
            icon="ArrowElbowLeft"
            onPress={() => {
              onPress?.(parentId)
            }}
            style={styles.button}
          />
        </View>
      ) : null}

      <SortIntervalMenu
        onChange={(next) => {
          onChangeSort(next.sort)
        }}
        sort={sort}
        type="comment"
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  button: {
    height: theme.space[8],
    width: theme.space[8],
  },
  main: (sticky: boolean) => {
    const base = {
      backgroundColor: theme.colors.gray[sticky ? 1 : 'a3'],
    }

    if (iPad) {
      return {
        ...base,
        alignSelf: 'center',
        borderCurve: sticky ? undefined : 'continuous',
        borderRadius: sticky ? undefined : theme.radius[3],
        maxWidth: cardMaxWidth,
        width: '100%',
      }
    }

    return base
  },
}))
