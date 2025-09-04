import { type StyleProp, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useCopy } from '~/hooks/copy'

import { IconButton } from './icon/button'
import { Text } from './text'
import { View } from './view'

type Props = {
  code?: boolean
  style?: StyleProp<ViewStyle>
  value: string
}

export function Copy({ code = true, style, value }: Props) {
  const a11y = useTranslations('a11y')

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

      <IconButton
        icon={{
          color: copied ? 'green' : 'accent',
          name: copied ? 'CheckCircle' : 'Copy',
        }}
        label={a11y(copied ? 'copied' : 'copy')}
        onPress={() => {
          copy(value)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
  },
  uri: {
    flex: 1,
  },
}))
