import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type SearchHistoryData } from '~/hooks/search'
import { space } from '~/styles/tokens'

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

  return (
    <View gap="4" px="3" py="4">
      <Text size="2" weight="medium">
        {t('title')}
      </Text>

      {history.history.map((query) => (
        <Pressable
          accessibilityLabel={a11y('searchQuery', {
            query,
          })}
          align="center"
          direction="row"
          gap="3"
          hitSlop={space[4]}
          key={query}
          onPress={() => {
            onChange(query)
          }}
        >
          <Icon
            name="magnifyingglass"
            uniProps={(theme) => ({
              tintColor: theme.colors.gray.text,
            })}
          />

          <Text style={styles.query}>{query}</Text>

          <Pressable
            accessibilityLabel={a11y('removeQuery', {
              query,
            })}
            hitSlop={space[4]}
            onPress={() => {
              history.remove(query)
            }}
          >
            <Icon
              name="xmark"
              uniProps={(theme) => ({
                tintColor: theme.colors.red.accent,
              })}
            />
          </Pressable>
        </Pressable>
      ))}

      <Pressable
        accessibilityLabel={a11y('clearQueries')}
        align="center"
        direction="row"
        gap="3"
        hitSlop={space[4]}
        onPress={() => {
          history.clear()
        }}
      >
        <Icon
          name="xmark"
          uniProps={(theme) => ({
            tintColor: theme.colors.red.accent,
          })}
        />

        <Text>{t('clear')}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  query: {
    flex: 1,
  },
})
