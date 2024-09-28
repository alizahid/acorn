import { Platform } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { cardMaxWidth } from '~/lib/const'
import { usePreferences } from '~/stores/preferences'

import { CommentsSortMenu } from '../comments/sort'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  commentId?: string
  onPress?: () => void
}

export function PostHeader({ commentId, onPress }: Props) {
  const { sortPostComments, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <View align="center" direction="row" style={styles.header()}>
      {commentId ? <HeaderButton icon="ArrowLeft" onPress={onPress} /> : null}

      <CommentsSortMenu
        onChange={(next) => {
          update({
            sortPostComments: next,
          })
        }}
        style={styles.sort}
        value={sortPostComments}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: () => {
    const iPad = Platform.OS === 'ios' && Platform.isPad

    return {
      alignSelf: 'center',
      borderCurve: 'continuous',
      borderRadius: iPad ? theme.radius[3] : undefined,
      maxWidth: iPad ? cardMaxWidth : undefined,
      width: '100%',
    }
  },
  sort: {
    marginLeft: 'auto',
  },
}))
