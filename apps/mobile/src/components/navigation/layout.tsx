import { type ReactNode, useContext } from 'react'
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

type Props = {
  children: ReactNode
}

export function ScreenLayout({ children }: Props) {
  const insets = useContext(SafeAreaInsetsContext)

  return (
    <SafeAreaProvider>
      <SafeAreaInsetsContext.Provider value={insets}>
        <SafeAreaView edges={['left', 'right']} style={styles.main}>
          {children}
        </SafeAreaView>
      </SafeAreaInsetsContext.Provider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
})
