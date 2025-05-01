import { FlashList } from '@shopify/flash-list'
import { parseISO } from 'date-fns'
import { useLocalSearchParams } from 'expo-router'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter } from 'use-intl'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { MessageCard } from '~/components/messages/card'
import { ReplyCard } from '~/components/messages/reply'
import { ListFlags, useList } from '~/hooks/list'
import { useMessages } from '~/hooks/queries/user/messages'
import { heights } from '~/lib/common'
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

  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.TOP)

  return (
    <KeyboardAvoidingView behavior="translate-with-padding" style={styles.main}>
      <FlashList
        {...listProps}
        ListEmptyComponent={() => (isLoading ? <Loading /> : <Empty />)}
        contentContainerStyle={styles.content}
        data={messages}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        keyboardDismissMode="interactive"
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
        }}
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ index, item }) => {
          if (typeof item === 'string') {
            return (
              <View self="center" style={styles.header(index)}>
                <Text highContrast={false} size="1" tabular weight="medium">
                  {f.dateTime(parseISO(item), {
                    dateStyle: 'medium',
                  })}
                </Text>
              </View>
            )
          }

          return (
            <MessageCard
              message={item}
              style={index > 0 ? styles.item : undefined}
              userId={accountId}
            />
          )
        }}
      />

      <ReplyCard id={params.id} user={params.user} />
    </KeyboardAvoidingView>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    padding: theme.space[4],
  },
  header: (index: number) => ({
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderRadius: theme.radius[6],
    marginBottom: theme.space[4],
    marginTop: index > 0 ? theme.space[4] : undefined,
    paddingHorizontal: theme.space[2],
    paddingVertical: theme.space[1],
  }),
  item: {
    marginBottom: theme.space[4],
  },
  main: {
    flex: 1,
    marginBottom: heights.tabBar + runtime.insets.bottom,
  },
}))
