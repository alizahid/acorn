import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Toaster } from 'sonner-native'

import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

import { getIcon } from './icon'

export function Toast() {
  const { font } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Toaster
      autoWiggleOnUpdate="always"
      gap={theme.space[2]}
      icons={{
        error: getIcon({
          color: 'red',
          name: 'Warning',
        }),
        info: getIcon({
          color: 'accent',
          name: 'Info',
        }),
        success: getIcon({
          color: 'green',
          name: 'CheckCircle',
        }),
        warning: getIcon({
          color: 'orange',
          name: 'Warning',
        }),
      }}
      style={styles.main}
      theme={theme.name}
      toastOptions={{
        titleStyle: styles.text(font),
        toastContentStyle: styles.content,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    gap: theme.space[2],
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
  },
  text: (font: Font) => ({
    fontFamily: fonts[font],
  }),
}))
