import {
  KeyboardAwareLegendList,
  useKeyboardChatComposerInset,
} from '@legendapp/list/keyboard'
import { type LegendListRef } from '@legendapp/list/react-native'
import { formatISO, isDate } from 'date-fns'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useHeaderHeight } from 'expo-router/react-navigation'
import { useRef } from 'react'
import { View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { Empty } from '~/components/common/empty'
import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { MessageCard } from '~/components/messages/card'
import { ReplyCard } from '~/components/messages/reply'
import { useThread } from '~/hooks/queries/user/thread'
import { glass } from '~/lib/common'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  id: z.string(),
  user: z.string(),
})

export type MessageParams = z.infer<typeof schema>

export default function Screen() {
  const router = useRouter()
  const params = schema.parse(useLocalSearchParams())
  const headerHeight = useHeaderHeight()

  const f = useFormatter()

  const list = useRef<LegendListRef>(null)
  const composerRef = useRef<View>(null)

  const { contentInsetEndAdjustment, onComposerLayout } =
    useKeyboardChatComposerInset(list, composerRef)

  const { accountId } = useAuth(
    useShallow((state) => ({
      accountId: state.accountId,
    })),
  )

  const { messages, refetch } = useThread(params.id)

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.View>
          <IconButton
            header
            label={params.user}
            onPress={() => {
              router.navigate({
                params: {
                  name: params.user,
                },
                pathname: '/users/[name]',
              })
            }}
          >
            <Icon name="info" />
          </IconButton>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <KeyboardAwareLegendList
        alignItemsAtEnd
        contentContainerStyle={styles.content(headerHeight)}
        contentInsetEndAdjustment={contentInsetEndAdjustment}
        data={messages}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialScrollAtEnd
        keyboardDismissMode="interactive"
        keyExtractor={(item) => (isDate(item) ? formatISO(item) : item.id)}
        ListEmptyComponent={() => <Empty />}
        maintainScrollAtEnd
        maintainVisibleContentPosition
        recycleItems
        ref={list}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ item }) => {
          if (isDate(item)) {
            return (
              <View style={styles.header}>
                <Text highContrast={false} size="1" tabular weight="medium">
                  {f.dateTime(item, {
                    dateStyle: 'medium',
                  })}
                </Text>
              </View>
            )
          }

          return <MessageCard message={item} userId={accountId} />
        }}
      />

      <KeyboardStickyView style={styles.composer}>
        <View onLayout={onComposerLayout} ref={composerRef}>
          <ReplyCard threadId={params.id} user={params.user} />
        </View>
      </KeyboardStickyView>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  composer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  content: (headerHeight: number) => ({
    paddingBottom: glass ? undefined : theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingTop: headerHeight + theme.space[4],
  }),
  header: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  separator: {
    height: theme.space[4],
  },
}))
