import { Pressable } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useReorderableDrag } from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { type Account } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

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

  const { themeOled, themeTint } = usePreferences()

  styles.useVariants({
    oled: themeOled,
    tint: themeTint,
  })

  const drag = useReorderableDrag()

  return (
    <Swipeable
      containerStyle={styles.delete}
      key={account.id}
      renderLeftActions={() => (
        <IconButton
          contrast
          icon="trash"
          label={a11y('removeAccount', {
            account: account.id,
          })}
          onPress={() => {
            onRemove(account.id)
          }}
        />
      )}
      renderRightActions={() => null}
    >
      <Pressable
        accessibilityHint={a11y('swipeAccount')}
        accessibilityLabel={account.id}
        accessibilityState={{
          selected: account.id === selected,
        }}
        onLongPress={drag}
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
    padding: theme.space[3],
    variants: {
      oled: {
        true: {
          backgroundColor: oledTheme[theme.variant].bg,
        },
      },
      tint: {
        true: {
          backgroundColor: theme.colors.accent.bg,
        },
      },
    },
  },
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
