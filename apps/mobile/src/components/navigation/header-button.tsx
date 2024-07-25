import { type Icon } from 'react-native-phosphor/src/lib'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type ColorToken } from '~/styles/colors'

import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'

type Props = {
  Icon: Icon
  color?: ColorToken
  contrast?: boolean
  loading?: boolean
  onPress?: () => void
}

export function HeaderButton({
  Icon,
  color = 'accent',
  contrast,
  loading,
  onPress,
}: Props) {
  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable disabled={loading} onPress={onPress} style={styles.main}>
      {loading ? (
        <Spinner color={color} contrast={contrast} />
      ) : (
        <Icon
          color={theme.colors[color][contrast ? 'contrast' : 11]}
          size={theme.space[5]}
        />
      )}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
    width: theme.space[8],
  },
}))
