import { useRouter } from 'expo-router'
import { useRef } from 'react'
import ActionSheet, { type ActionSheetRef } from 'react-native-actions-sheet'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { SheetHeader } from '~/sheets/header'
import { useAuth } from '~/stores/auth'

import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'

export function AccountSwitchCard() {
  const router = useRouter()

  const t = useTranslations('component.users.switch')

  const { accountId, accounts, order, removeAccount, setAccount } = useAuth()

  const { styles, theme } = useStyles(stylesheet)

  const sheet = useRef<ActionSheetRef>(null)

  return (
    <>
      <HeaderButton
        icon="UserSwitch"
        onPress={() => {
          sheet.current?.show()
        }}
      />

      <ActionSheet
        containerStyle={styles.sheet}
        gestureEnabled
        indicatorStyle={styles.indicator}
        overlayColor={theme.colors.gray.a9}
        ref={sheet}
      >
        <SheetHeader
          right={
            <HeaderButton
              color="green"
              icon="PlusCircle"
              onPress={() => {
                router.push('/sign-in?mode=dismissible')

                sheet.current?.hide()
              }}
            />
          }
          title={t('title')}
        />

        {accounts.map((account, index) => (
          <Swipeable
            containerStyle={styles.swipeable}
            key={account.id}
            renderLeftActions={() =>
              index > 0 ? (
                <HeaderButton
                  contrast
                  icon="ArrowUp"
                  onPress={() => {
                    order(account.id, 'up')
                  }}
                  style={styles.move}
                  weight="bold"
                />
              ) : index < accounts.length - 1 ? (
                <HeaderButton
                  contrast
                  icon="ArrowDown"
                  onPress={() => {
                    order(account.id, 'down')
                  }}
                  style={styles.move}
                  weight="bold"
                />
              ) : null
            }
            renderRightActions={() => (
              <HeaderButton
                contrast
                icon="Trash"
                onPress={() => {
                  removeAccount(account.id)
                }}
                style={styles.delete}
              />
            )}
          >
            <Pressable
              onPress={() => {
                if (account.id !== accountId) {
                  setAccount(account.id)
                }

                sheet.current?.hide()
              }}
              p="3"
              style={[
                styles.item,
                account.id === accountId && styles.swipeable,
              ]}
            >
              <Text weight="medium">{account.id}</Text>
            </Pressable>
          </Swipeable>
        ))}
      </ActionSheet>
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  delete: {
    backgroundColor: theme.colors.red.a9,
  },
  indicator: {
    display: 'none',
  },
  item: {
    backgroundColor: theme.colors.gray[1],
  },
  move: {
    backgroundColor: theme.colors.accent.a9,
  },
  sheet: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: runtime.insets.bottom,
  },
  swipeable: {
    backgroundColor: theme.colors.accent[5],
  },
}))
