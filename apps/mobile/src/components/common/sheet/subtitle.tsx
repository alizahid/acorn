import { type StyleProp, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { Text } from '~/components/common/text'

type Props = {
  style?: StyleProp<TextStyle>
  title: string
}

export function Subtitle({ style, title }: Props) {
  return (
    <Text
      highContrast={false}
      numberOfLines={1}
      size="2"
      style={[styles.main, style]}
      weight="medium"
    >
      {title}
    </Text>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    justifyContent: 'center',
    marginBottom: theme.space[1],
    marginLeft: theme.space[8],
  },
}))
