import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  history: Array<string>
  onClear: () => void
  onPress: (query: string) => void
}

export function SearchHistory({ history, onClear, onPress }: Props) {
  const t = useTranslations('component.search.history')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View align="center" flexGrow={1} gap="6" justify="center" p="6">
      <Icon
        color={theme.colors.gray.a9}
        name="MagnifyingGlass"
        size={theme.space[8]}
        weight="duotone"
      />

      <View direction="row" gap="4" justify="center" wrap="wrap">
        {history.map((query) => (
          <Pressable
            key={query}
            onPress={() => {
              onPress(query)
            }}
            px="2"
            py="1"
            style={styles.query}
          >
            <Text>{query}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          onClear()
        }}
        px="2"
        py="1"
        style={[styles.query, styles.clear]}
      >
        <Text color="red" contrast size="2">
          {t('clear')}
        </Text>
      </Pressable>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    backgroundColor: theme.colors.red.a9,
  },
  query: {
    backgroundColor: theme.colors.accent.a4,
    borderCurve: 'continuous',
    borderRadius: theme.radius[3],
  },
}))
