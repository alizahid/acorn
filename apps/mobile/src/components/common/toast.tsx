import { ActivityIndicator } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { Toaster } from 'sonner-native'

import { iPad } from '~/lib/common'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { weights } from '~/styles/text'

import { Icon } from './icon'

export function Toast() {
  const { font, fontScaling } = usePreferences()

  styles.useVariants({
    iPad,
  })

  const { theme } = useUnistyles()

  return (
    <Toaster
      autoWiggleOnUpdate="always"
      icons={{
        error: (
          <Icon
            name="exclamationmark.triangle.fill"
            tintColor={theme.colors.red.accent}
          />
        ),
        info: (
          <Icon name="info.circle" tintColor={theme.colors.accent.accent} />
        ),
        loading: <ActivityIndicator size={theme.typography[3].lineHeight} />,
        success: (
          <Icon name="checkmark.circle" tintColor={theme.colors.green.accent} />
        ),
        warning: (
          <Icon
            name="exclamationmark.circle.fill"
            tintColor={theme.colors.orange.accent}
          />
        ),
      }}
      theme={theme.variant}
      toastOptions={{
        closeButtonStyle: styles.close,
        descriptionStyle: styles.description(font, fontScaling),
        style: styles.main,
        titleStyle: styles.title(font, fontScaling),
        toastContainerStyle: styles.container,
        toastContentStyle: styles.content,
        unstyled: true,
      }}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  close: {
    alignItems: 'center',
    height: theme.typography[3].lineHeight,
    justifyContent: 'center',
    width: theme.typography[3].lineHeight,
  },
  container: {
    variants: {
      iPad: {
        true: {
          maxWidth: 600,
        },
      },
    },
  },
  content: {
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[3],
  },
  description: (font: Font, scaling: number) => ({
    color: theme.colors.gray.textLow,
    fontFamily: fonts[font],
    fontSize: theme.typography[2].fontSize * scaling,
    lineHeight: theme.typography[2].lineHeight * scaling,
    marginTop: theme.space[1],
  }),
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
    marginHorizontal: theme.space[4],
    marginVertical: theme.space[2],
  },
  title: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    fontWeight: weights.medium,
    lineHeight: theme.typography[3].lineHeight * scaling,
  }),
}))
