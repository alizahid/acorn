import { FlashList } from '@shopify/flash-list'
import { formatISO, isDate } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { MessageCard } from '~/components/messages/card'
import { useList } from '~/hooks/list'
import { useMessages } from '~/hooks/queries/user/messages'
import { useAuth } from '~/stores/auth'

const schema = z.object({
  id: z.string(),
  user: z.string(),
})

export type MessageParams = z.infer<typeof schema>

export default function Screen() {
  const params = schema.parse(useLocalSearchParams())

  const f = useFormatter()

  const { accountId } = useAuth()

  const { isLoading, messages, refetch } = useMessages(params.id)

  const listProps = useList()

  return (
    <FlashList
      {...listProps}
      contentContainerStyle={styles.content}
      data={messages}
      ItemSeparatorComponent={() => <View height="4" />}
      keyboardDismissMode="interactive"
      keyExtractor={(item) => (isDate(item) ? formatISO(item) : item.id)}
      ListEmptyComponent={() => (isLoading ? <Loading /> : <Empty />)}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.5,
        startRenderingFromBottom: true,
      }}
      refreshControl={<RefreshControl onRefresh={refetch} />}
      renderItem={({ item }) => {
        if (isDate(item)) {
          return (
            <View self="center" style={styles.header}>
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
  )
}

const styles = StyleSheet.create((theme) => ({
  content: {
    padding: theme.space[4],
  },
  header: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  },
}))
