import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCopy } from '~/hooks/copy'

import { HeaderButton } from '../navigation/header-button'
import { Text } from './text'
import { View } from './view'

type Props = {
  code?: boolean
  style?: StyleProp<ViewStyle>
  value: string
}

export function Copy({ code = true, style, value }: Props) {
  const { styles } = useStyles(stylesheet)

  const { copied, copy } = useCopy()

  return (
    <View align="center" direction="row" style={[styles.main, style]}>
      <Text
        mx="4"
        style={styles.uri}
        variant={code ? 'mono' : 'sans'}
        weight="medium"
      >
        {value}
      </Text>

      <HeaderButton
        color={copied ? 'green' : 'accent'}
        icon={copied ? 'CheckCircle' : 'Copy'}
        onPress={() => {
          void copy(value)
        }}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  uri: {
    flex: 1,
  },
}))
