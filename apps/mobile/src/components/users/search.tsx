import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { TextBox } from '~/components/common/text-box'

import { IconButton } from '../common/icon-button'

type Props = {
  onChange: (value: string) => void
  value: string
}

export function UserSearchBar({ onChange, value }: Props) {
  const t = useTranslations('component.users.search')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <TextBox
      left={
        <Icon
          color={theme.colors.gray.accent}
          name="MagnifyingGlass"
          style={styles.icon}
        />
      }
      onChangeText={onChange}
      placeholder={t('placeholder')}
      returnKeyType="search"
      right={
        value.length > 0 ? (
          <IconButton
            icon={{
              color: 'gray',
              name: 'XCircle',
              weight: 'fill',
            }}
            onPress={() => {
              onChange('')
            }}
            style={styles.clear}
          />
        ) : null
      }
      style={styles.main}
      styleContent={styles.content}
      value={value}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  content: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  icon: {
    marginLeft: theme.space[3],
  },
  main: {
    flexGrow: 1,
    height: theme.space[8],
  },
}))
