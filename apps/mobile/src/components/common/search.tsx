import {
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { TextBox } from '~/components/common/text-box'

import { IconButton } from './icon/button'

type Props = {
  onChange?: (value: string) => void
  onSubmitEditing?: TextInputProps['onSubmitEditing']
  placeholder?: 'search' | 'filter'
  style?: StyleProp<ViewStyle>
  value?: string
}

export function SearchBox({
  onChange,
  onSubmitEditing,
  placeholder = 'filter',
  style,
  value,
}: Props) {
  const t = useTranslations('component.common.search')
  const a11y = useTranslations('a11y')

  return (
    <TextBox
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      left={
        <Icon
          name="magnifyingglass"
          style={styles.icon}
          uniProps={(theme) => ({
            tintColor: theme.colors.gray.accent,
          })}
        />
      }
      onChangeText={onChange}
      onSubmitEditing={onSubmitEditing}
      placeholder={t(placeholder)}
      returnKeyType="search"
      right={
        value?.length ? (
          <IconButton
            color="gray"
            icon="xmark.circle.fill"
            label={a11y('clearQuery')}
            onPress={() => {
              onChange?.('')
            }}
            style={styles.clear}
          />
        ) : null
      }
      style={[styles.main, style]}
      value={value}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  clear: {
    height: theme.space[7],
    width: theme.space[7],
  },
  icon: {
    marginLeft: theme.space[3],
  },
  main: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    flexGrow: 1,
    height: theme.space[8],
  },
}))
