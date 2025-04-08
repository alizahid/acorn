import {
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { TextBox } from '~/components/common/text-box'

import { IconButton } from './icon-button'

type Props = {
  onChange?: (value: string) => void
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  style?: StyleProp<ViewStyle>
  value?: string
}

export function SearchBox({ onChange, onSubmitEditing, style, value }: Props) {
  const t = useTranslations('component.common.search')
  const a11y = useTranslations('a11y')

  const { styles, theme } = useStyles(stylesheet)

  return (
    <TextBox
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      left={
        <Icon
          color={theme.colors.gray.accent}
          name="MagnifyingGlass"
          style={styles.icon}
        />
      }
      onChangeText={onChange}
      onSubmitEditing={onSubmitEditing}
      placeholder={t('placeholder')}
      returnKeyType="search"
      right={
        value?.length ? (
          <IconButton
            icon={{
              color: 'gray',
              name: 'XCircle',
              weight: 'fill',
            }}
            label={a11y('clearQuery')}
            onPress={() => {
              onChange?.('')
            }}
            style={styles.clear}
          />
        ) : null
      }
      style={[styles.main, style]}
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
