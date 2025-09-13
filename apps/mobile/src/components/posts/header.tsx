import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { cardMaxWidth, iPad } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { IconButton } from '../common/icon/button'
import { View } from '../common/view'

type Props = {
  onPress?: (commentId?: string) => void
  parentId?: string
}

export function PostHeader({ onPress, parentId }: Props) {
  const a11y = useTranslations('a11y')

  const { themeOled, themeTint } = usePreferences()

  styles.useVariants({
    iPad,
    oled: themeOled,
    tint: themeTint,
  })

  return (
    <View direction="row" mt={themeOled ? '1' : '2'} style={styles.main}>
      <IconButton
        icon="arrow.uturn.left"
        label={a11y('viewFullThread')}
        onPress={() => {
          onPress?.()
        }}
      />

      <IconButton
        icon="arrow.up.left"
        label={a11y('viewParentThread')}
        onPress={() => {
          onPress?.(parentId)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    backgroundColor: theme.colors.gray.ui,
    variants: {
      iPad: {
        true: {
          alignSelf: 'center',
          borderCurve: 'continuous',
          borderRadius: theme.radius[3],
          maxWidth: cardMaxWidth,
          width: '100%',
        },
      },
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.ui,
        },
      },
    },
  },
}))
