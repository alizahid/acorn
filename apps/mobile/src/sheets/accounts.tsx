import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { createCallable } from 'react-call'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '~/components/common/pressable'
import { Text } from '~/components/common/text'
import { HeaderButton } from '~/components/navigation/header-button'
import { SheetHeader } from '~/components/sheets/header'
import { listProps } from '~/lib/common'
import { useAuth } from '~/stores/auth'

import { SheetBackDrop } from '../components/sheets/back-drop'

export const AccountsSheet = createCallable(function Component() {
  const router = useRouter()

  const t = useTranslations('sheet.accounts')

  const { styles } = useStyles(stylesheet)

  const sheet = useRef<BottomSheet>(null)

  const { accountId, accounts, order, removeAccount, setAccount } = useAuth()

  return (
    <BottomSheet
      backdropComponent={SheetBackDrop}
      backgroundStyle={styles.background}
      enablePanDownToClose
      handleComponent={null}
      maxDynamicContentSize={styles.maxHeight.height}
      ref={sheet}
      style={styles.main}
    >
      <BottomSheetFlatList
        {...listProps}
        ListHeaderComponent={
          <SheetHeader
            right={
              <HeaderButton
                color="green"
                icon="PlusCircle"
                onPress={() => {
                  router.push('/sign-in?mode=dismissible')

                  sheet.current?.close()
                }}
              />
            }
            title={t('title')}
          />
        }
        contentContainerStyle={styles.content}
        data={accounts}
        renderItem={({ index, item }) => (
          <Swipeable
            containerStyle={styles.swipeable}
            key={item.id}
            renderLeftActions={() =>
              index > 0 ? (
                <HeaderButton
                  contrast
                  icon="ArrowUp"
                  onPress={() => {
                    order(item.id, 'up')
                  }}
                  style={styles.move}
                  weight="bold"
                />
              ) : index < accounts.length - 1 ? (
                <HeaderButton
                  contrast
                  icon="ArrowDown"
                  onPress={() => {
                    order(item.id, 'down')
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
                  removeAccount(item.id)
                }}
                style={styles.delete}
              />
            )}
          >
            <Pressable
              onPress={() => {
                if (item.id !== accountId) {
                  setAccount(item.id)
                }

                sheet.current?.close()
              }}
              p="3"
              style={[styles.item, item.id === accountId && styles.swipeable]}
            >
              <Text weight="medium">{item.id}</Text>
            </Pressable>
          </Swipeable>
        )}
      />
    </BottomSheet>
  )
}, 250)

const stylesheet = createStyleSheet((theme, runtime) => ({
  background: {
    backgroundColor: theme.colors.gray[1],
    borderRadius: 0,
  },
  content: {
    paddingBottom: runtime.insets.bottom,
  },
  delete: {
    backgroundColor: theme.colors.red.a9,
  },
  empty: {
    marginHorizontal: 'auto',
    marginVertical: theme.space[4],
  },
  header: {
    alignItems: 'flex-start',
    backgroundColor: theme.colors.gray[2],
    paddingHorizontal: theme.space[3],
  },
  image: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.typography[3].lineHeight,
    height: theme.typography[3].lineHeight,
    width: theme.typography[3].lineHeight,
  },
  item: {
    backgroundColor: theme.colors.gray[1],
  },
  main: {
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[5],
    borderTopRightRadius: theme.radius[5],
    overflow: 'hidden',
  },
  maxHeight: {
    height: runtime.screen.height * 0.8,
  },
  move: {
    backgroundColor: theme.colors.accent.a9,
  },
  swipeable: {
    backgroundColor: theme.colors.accent[5],
  },
}))
