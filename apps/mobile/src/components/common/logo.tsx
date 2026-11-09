import { Image, type ImageStyle } from 'expo-image'
import { type StyleProp } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import acorn from '~/assets/images/acorn.svg'

type Props = {
  style?: StyleProp<ImageStyle>
}

export function Logo({ style }: Props) {
  return <Image source={acorn} style={[styles.main, style]} />
}

const styles = StyleSheet.create((theme) => ({
  main: {
    height: theme.space[9],
    width: theme.space[9],
  },
}))
