import { Pressable } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type Account } from '~/stores/auth'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'

type Props = {
  account: Account
  onChange: (id: string) => void
  onClose: () => void
  onRemove: (id: string) => void
  selected?: string
}

export function AccountCard({
  account,
  onChange,
  onClose,
  onRemove,
  selected,
}: Props) {
  const a11y = useTranslations('a11y')

  return (
    <Swipeable
      containerStyle={styles.delete}
      key={account.id}
      renderLeftActions={() => (
        <IconButton
          label={a11y('removeAccount', {
            account: account.id,
          })}
          onPress={() => {
            onRemove(account.id)
          }}
        >
          <Icon
            name="trash"
            uniProps={(theme) => ({
              color: theme.colors.accent.contrast,
            })}
          />
        </IconButton>
      )}
      renderRightActions={() => null}
    >
      <Pressable
        accessibilityHint={a11y('swipeAccount')}
        accessibilityLabel={account.id}
        accessibilityState={{
          selected: account.id === selected,
        }}
        onPress={() => {
          if (account.id !== selected) {
            onChange(account.id)
          }

          onClose()
        }}
        style={[styles.main, account.id === selected && styles.selected]}
      >
        <Text weight="medium">{account.id}</Text>
      </Pressable>
    </Swipeable>
  )
}

const styles = StyleSheet.create((theme) => ({
  delete: {
    backgroundColor: theme.colors.red.accent,
  },
  main: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray.bg,
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
