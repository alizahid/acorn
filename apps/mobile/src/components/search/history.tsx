import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type SearchHistoryData } from '~/hooks/search'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  history: SearchHistoryData
  onChange: (query: string) => void
}

export function SearchHistory({ history, onChange }: Props) {
  const t = useTranslations('component.search.history')
  const a11y = useTranslations('a11y')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View gap="4" px="3" py="4">
      <Text size="2" weight="medium">
        {t('title')}
      </Text>

      {history.history.map((query) => (
        <Pressable
          align="center"
          direction="row"
          gap="3"
          hitSlop={theme.space[4]}
          key={query}
          label={query}
          onPress={() => {
            onChange(query)
          }}
        >
          <Icon color={theme.colors.gray.text} name="MagnifyingGlass" />

          <Text style={styles.query}>{query}</Text>

          <Pressable
            hitSlop={theme.space[4]}
            label={a11y('removeQuery', {
              query,
            })}
            onPress={() => {
              history.remove(query)
            }}
          >
            <Icon color={theme.colors.red.accent} name="X" weight="bold" />
          </Pressable>
        </Pressable>
      ))}

      <Pressable
        align="center"
        direction="row"
        gap="3"
        hitSlop={theme.space[4]}
        label={t('clear')}
        onPress={() => {
          history.clear()
        }}
      >
        <Icon color={theme.colors.red.accent} name="X" weight="bold" />

        <Text>{t('clear')}</Text>
      </Pressable>
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  query: {
    flex: 1,
  },
}))
