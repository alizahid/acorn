import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { CommunitiesList } from '../communities/list'

type Props = {
  onClose: () => void
}

export function HomeDrawer({ onClose }: Props) {
  const { stickyDrawer, themeOled, themeTint } = usePreferences([
    'stickyDrawer',
    'themeOled',
    'themeTint',
  ])

  styles.useVariants({
    oled: themeOled,
    sticky: iPad && stickyDrawer,
    tint: themeTint,
  })

  return (
    <View style={styles.main}>
      <CommunitiesList
        drawer
        onPress={() => {
          onClose()
        }}
        style={styles.content}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    marginTop: runtime.insets.top,
    paddingRight: theme.space[1],
  },
  main: {
    backgroundColor: theme.colors.gray.bgAlt,
    borderRightColor: theme.colors.gray.border,
    flex: 1,
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      sticky: {
        true: {
          borderRightWidth: StyleSheet.hairlineWidth,
          width: runtime.screen.width * 0.3,
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
