import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { TextBox } from '../common/text-box'
import { View } from '../common/view'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  onChange: (query: string) => void
  query: string
}

export function SearchHeader({ onChange, query }: Props) {
  const t = useTranslations('component.search.header')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <View mx="4">
        <Icon
          color={theme.colors.gray.a9}
          name="MagnifyingGlass"
          style={styles.search}
        />

        <TextBox
          onChangeText={onChange}
          placeholder={t('placeholder')}
          styleInput={styles.input}
          value={query}
        />

        {query.length > 0 ? (
          <HeaderButton
            color="gray"
            icon="XCircle"
            onPress={() => {
              onChange('')
            }}
            style={styles.clear}
            weight="fill"
          />
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    position: 'absolute',
    right: 0,
    top: 0,
    width: theme.space[7],
  },
  input: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.radius[4],
    borderWidth: 0,
    paddingLeft: theme.space[2] * 2 + theme.space[5],
  },
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  search: {
    left: theme.space[2],
    position: 'absolute',
    top: theme.space[2],
  },
}))
