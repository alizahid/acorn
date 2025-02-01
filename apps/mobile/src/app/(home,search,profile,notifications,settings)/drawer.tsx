import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { TextBox } from '~/components/common/text-box'
import { CommunitiesList } from '~/components/communities/list'
import { useList } from '~/hooks/list'

export default function Screen() {
  const t = useTranslations('screen.drawer')

  const { styles, theme } = useStyles(stylesheet)

  const listProps = useList({
    header: false,
  })

  const [query, setQuery] = useState('')

  return (
    <>
      <TextBox
        left={
          <Icon
            color={theme.colors.gray.accent}
            name="MagnifyingGlass"
            style={styles.icon}
          />
        }
        onChangeText={setQuery}
        placeholder={t('search.placeholder')}
        returnKeyType="search"
        right={
          query.length > 0 ? (
            <IconButton
              icon={{
                color: 'gray',
                name: 'XCircle',
                weight: 'fill',
              }}
              onPress={() => {
                setQuery('')
              }}
            />
          ) : null
        }
        style={styles.search}
        styleContent={styles.content}
        value={query}
      />

      <CommunitiesList listProps={listProps} />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  icon: {
    marginLeft: theme.space[3],
  },
  search: {
    height: theme.space[8],
    marginTop: runtime.insets.top,
  },
}))
