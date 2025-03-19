import { ActivityIndicator } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { Toaster } from 'sonner-native'

import { iPad } from '~/lib/common'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { weights } from '~/styles/text'

import { getIcon } from './icon'

export function Toast() {
  const { font } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Toaster
      autoWiggleOnUpdate="always"
      icons={{
        error: getIcon({
          color: 'red',
          name: 'Warning',
        }),
        info: getIcon({
          color: 'accent',
          name: 'Info',
        }),
        loading: <ActivityIndicator size={theme.typography[3].lineHeight} />,
        success: getIcon({
          color: 'green',
          name: 'CheckCircle',
        }),
        warning: getIcon({
          color: 'orange',
          name: 'Warning',
        }),
      }}
      theme={theme.name}
      toastOptions={{
        closeButtonStyle: styles.close,
        descriptionStyle: styles.description(font),
        style: styles.main,
        titleStyle: styles.title(font),
        toastContainerStyle: styles.container,
        toastContentStyle: styles.content,
        unstyled: true,
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  close: {
    alignItems: 'center',
    height: theme.typography[3].lineHeight,
    justifyContent: 'center',
    width: theme.typography[3].lineHeight,
  },
  container: {
    maxWidth: iPad ? 600 : undefined,
  },
  content: {
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  description: (font: Font) => ({
    color: theme.colors.gray.textLow,
    fontFamily: fonts[font],
    fontSize: theme.typography[2].fontSize,
    lineHeight: theme.typography[2].lineHeight,
    marginTop: theme.space[1],
  }),
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
    marginHorizontal: theme.space[4],
    marginVertical: theme.space[2],
  },
  title: (font: Font) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize,
    fontWeight: weights.medium,
    lineHeight: theme.typography[3].lineHeight,
  }),
}))
