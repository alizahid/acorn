import { Text, View } from 'react-native'
import Acorn from 'react-native-phosphor/src/icons/Acorn'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

export default function Screen() {
  const t = useTranslations('screen.landing')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Acorn color={theme.colors.accentA[11]} size={64} weight="duotone" />

      <Text style={styles.title}>{t('title')}</Text>
    </View>
  )
}

const stylesheet = createStyleSheet(theme => ({
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray[1],
    flex: 1,
    gap: theme.margins[4],
    justifyContent: 'center',
  },
  title: {
    ...theme.typography[6],
    color: theme.colors.accentA[12],
    fontWeight: '700',
  },
}))
