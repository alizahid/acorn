import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'

type Props = {
  onBack: () => void
}

export function CommentThreadCard({ onBack }: Props) {
  const t = useTranslations('component.comments.thread')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      direction="row"
      gap="2"
      onPress={() => {
        onBack()
      }}
      p="3"
      style={styles.main}
    >
      <Icon
        color={theme.colors.accent.a11}
        name="ArrowLeft"
        size={theme.typography[2].lineHeight}
        weight="bold"
      />

      <Text color="accent" size="2" weight="medium">
        {t('back')}
      </Text>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.accent.a3,
  },
}))
