import { useCallback, useState } from 'react'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useKeyboard } from '~/hooks/keyboard'
import { useReply } from '~/hooks/mutations/messages/reply'
import { heights, iPad } from '~/lib/common'

import { IconButton } from '../common/icon/button'
import { TextBox } from '../common/text-box'

type Props = {
  threadId: string
  user: string
}

export function ReplyCard({ threadId, user }: Props) {
  const t = useTranslations('component.messages.reply')
  const a11y = useTranslations('a11y')

  const { createReply, isPending } = useReply()

  const open = useKeyboard()

  const [value, setValue] = useState('')

  const onSubmit = useCallback(() => {
    const text = value.trim()

    if (text.length === 0) {
      return
    }

    createReply({
      text,
      threadId,
      user,
    })

    setValue('')
  }, [createReply, value, threadId, user])

  return (
    <KeyboardStickyView style={styles.main(open)}>
      <TextBox
        onChangeText={setValue}
        onSubmitEditing={() => {
          onSubmit()
        }}
        placeholder={t('placeholder')}
        returnKeyType="send"
        style={styles.input}
        value={value}
      />

      <IconButton
        icon="paperplane"
        label={a11y('createReply')}
        loading={isPending}
        onPress={() => {
          onSubmit()
        }}
        style={styles.submit}
      />
    </KeyboardStickyView>
  )
}

const styles = StyleSheet.create((theme, runtime) => ({
  input: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
  main: (open: boolean) => ({
    backgroundColor: theme.colors.gray.ui,
    flexDirection: 'row',
    marginBottom: open
      ? 0
      : (iPad ? 0 : theme.space[4] + heights.tabBar) + runtime.insets.bottom,
  }),
  submit: {
    alignSelf: 'flex-end',
  },
}))
