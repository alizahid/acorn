import { useLocalSearchParams } from 'expo-router'
import { FlatList } from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { Empty } from '~/components/common/empty'
import { Loading } from '~/components/common/loading'
import { RefreshControl } from '~/components/common/refresh-control'
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

  const { accountId } = useAuth()

  const { isLoading, messages, refetch } = useMessages(params.id)

  const { styles } = useStyles(stylesheet)

  const listProps = useList(ListFlags.TOP)

  return (
    <KeyboardAvoidingView behavior="translate-with-padding" style={styles.main}>
      <FlatList
        {...listProps}
        ItemSeparatorComponent={() => <View height="4" />}
        ListEmptyComponent={() => (isLoading ? <Loading /> : <Empty />)}
        contentContainerStyle={styles.content}
        contentInset={{
          bottom: listProps.contentInset?.top,
          top: listProps.contentInset?.bottom,
        }}
        contentOffset={undefined}
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        keyboardDismissMode="interactive"
        refreshControl={<RefreshControl onRefresh={refetch} />}
        renderItem={({ item }) => (
          <MessageCard message={item} userId={accountId} />
        )}
        scrollIndicatorInsets={undefined}
      />

      <ReplyCard id={params.id} user={params.user} />
    </KeyboardAvoidingView>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    padding: theme.space[4],
  },
  main: {
    flex: 1,
    marginBottom: heights.tabBar + runtime.insets.bottom,
  },
}))
