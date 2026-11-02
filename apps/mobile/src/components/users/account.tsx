import { Pressable } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type Account } from '~/stores/auth'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Swipeable } from '../common/swipeable'
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

  const variants = styles.useVariants({
    selected: account.id === selected,
  })

  return (
    <Swipeable
      left={
        <IconButton
          accessibilityLabel={a11y('removeAccount', {
            account: account.id,
          })}
          onPress={() => {
            onRemove(account.id)
          }}
        >
          <Icon
            name="trash"
            uniProps={(theme) => ({
              color: theme.colors.red.accent,
            })}
          />
        </IconButton>
      }
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
        style={variants.main}
      >
        <Text weight="medium">{account.id}</Text>
      </Pressable>
    </Swipeable>
  )
}

const styles = StyleSheet.create((theme) => ({
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
    variants: {
      selected: {
        true: {
          backgroundColor: theme.colors.accent.uiActive,
        },
      },
    },
  },
}))
