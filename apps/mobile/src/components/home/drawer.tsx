import { type DrawerContentComponentProps } from '@react-navigation/drawer'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { SearchBox } from '../common/search'
import { CommunitiesList } from '../communities/list'

type Props = DrawerContentComponentProps

export function HomeDrawer({ navigation }: Props) {
  const { themeOled, themeTint } = usePreferences(['themeOled', 'themeTint'])

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  const [query, setQuery] = useState('')

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <SearchBox onChange={setQuery} value={query} />
      </View>

      <CommunitiesList
        onPress={() => {
          navigation.closeDrawer()
        }}
        query={query}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  header: {
    marginTop: runtime.insets.top,
    paddingRight: theme.space[1],
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderRightColor: theme.colors.gray.border,
    flex: 1,
    variants: {
      iPad: {
        true: {
          borderRightWidth: StyleSheet.hairlineWidth,
          width: runtime.screen.width * 0.3,
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bgAlt,
        },
      },
    },
  },
}))
