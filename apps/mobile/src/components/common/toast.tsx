import { StyleSheet } from 'react-native-unistyles'
import { Toaster } from 'sonner-native'
import { useShallow } from 'zustand/react/shallow'

import { iPad } from '~/lib/common'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'
import { weights } from '~/styles/text'
import { space } from '~/styles/tokens'

import { Icon } from './icon'
import { Spinner } from './spinner'

export function Toast() {
  const { font } = usePreferences(
    useShallow((state) => ({
      font: state.font,
    })),
  )

  styles.useVariants({
    iPad,
  })

  return (
    <Toaster
      autoWiggleOnUpdate="always"
      icons={{
        error: (
          <Icon
            name="warning-fill"
            uniProps={(theme) => ({
              color: theme.colors.red.accent,
            })}
          />
        ),
        info: (
          <Icon
            name="info-fill"
            uniProps={(theme) => ({
              color: theme.colors.accent.accent,
            })}
          />
        ),
        loading: <Spinner size={space[5]} />,
        success: (
          <Icon
            name="check-circle-fill"
            uniProps={(theme) => ({
              color: theme.colors.green.accent,
            })}
          />
        ),
        warning: (
          <Icon
            name="warning-circle-fill"
            uniProps={(theme) => ({
              color: theme.colors.orange.accent,
            })}
          />
        ),
      }}
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
          alignSelf: 'center',
          maxWidth: 400,
        },
      },
    },
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
    backgroundColor: theme.colors.gray.bgAlt,
    borderColor: theme.colors.gray.border,
    borderCurve: 'continuous',
    borderRadius: theme.radius[5],
    borderWidth: StyleSheet.hairlineWidth,
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
