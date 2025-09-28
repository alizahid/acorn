import { useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useReply } from '~/hooks/mutations/messages/reply'

import { IconButton } from '../common/icon/button'
import { TextBox } from '../common/text-box'
import { View } from '../common/view'

type Props = {
  threadId: string
  user: string
}

export function ReplyCard({ threadId, user }: Props) {
  const t = useTranslations('component.messages.reply')
  const a11y = useTranslations('a11y')

  const { createReply, isPending } = useReply()

  const [text, setText] = useState('')

  return (
    <View direction="row" style={styles.main}>
      <TextBox
        multiline
        onChangeText={setText}
        placeholder={t('placeholder')}
        style={styles.input}
        value={text}
      />

      <IconButton
        icon="paperplane"
        label={a11y('createReply')}
        loading={isPending}
        onPress={() => {
          if (text.length === 0) {
            return
          }

          createReply({
            text,
            threadId,
            user,
          })

          setText('')
        }}
        style={styles.submit}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
    maxHeight: 300,
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
  },
  submit: {
    alignSelf: 'flex-end',
  },
}))
