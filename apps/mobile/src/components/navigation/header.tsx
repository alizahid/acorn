import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { BlurView } from 'expo-blur'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '../common/text'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ options }: Props) {
  const insets = useSafeAreaInsets()

  const { styles } = useStyles(stylesheet)

  return (
    <BlurView intensity={100} style={styles.main(insets.top)}>
      <View style={styles.header}>
        <Text highContrast weight="bold">
          {options.title}
        </Text>
      </View>
    </BlurView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    alignItems: 'center',
    height: theme.space[8],
    justifyContent: 'center',
  },
  main: (inset: number) => ({
    backgroundColor: theme.colors.grayA[1],
    left: 0,
    paddingTop: inset,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
}))
