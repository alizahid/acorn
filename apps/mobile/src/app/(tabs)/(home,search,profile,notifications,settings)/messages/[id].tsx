import { FlashList } from '@shopify/flash-list'
import { formatISO, isDate } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { KeyboardChatScrollView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { MessageCard } from '~/components/messages/card'
import { ReplyCard } from '~/components/messages/reply'
import { useThread } from '~/hooks/queries/user/thread'
import { listProps } from '~/lib/list'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  id: z.string(),
  user: z.string(),
})

export type MessageParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const f = useFormatter()

  const { accountId } = useAuth(['accountId'])

  const { messages, refetch } = useThread(params.id)

  return (
    <>
      <FlashList
        {...listProps}
        contentContainerStyle={styles.content}
        data={messages}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="interactive"
        keyExtractor={(item) => (isDate(item) ? formatISO(item) : item.id)}
        ListEmptyComponent={() => <Empty />}
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
        }}
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
        renderScrollComponent={KeyboardChatScrollView}
      />

      <ReplyCard threadId={params.id} user={params.user} />
    </>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  content: {
    padding: theme.space[4],
  },
  header: {
    alignSelf: 'center',
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
  main: {
    flex: 1,
    marginBottom: runtime.insets.bottom,
  },
  separator: {
    height: theme.space[4],
  },
}))
