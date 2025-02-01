import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon-button'
import { TextBox } from '~/components/common/text-box'

type Props = {
  onChange: (value: string) => void
  value: string
}

export function CommunitySearchBox({ onChange, value }: Props) {
  const t = useTranslations('component.communities.searchBox')

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
          />
        ) : null
      }
      style={styles.main}
      styleContent={styles.content}
      value={value}
    />
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
  main: {
    height: theme.space[8],
    marginTop: runtime.insets.top,
  },
}))
