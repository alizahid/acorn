import { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useReply } from '~/hooks/mutations/messages/reply'
import { glass } from '~/lib/common'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Spinner } from '../common/spinner'
import { TextBox } from '../common/text-box'
import { BlurView } from '../native/blur-view'
import { GlassView } from '../native/glass-view'

type Props = {
  threadId: string
  user: string
}

export function ReplyCard({ threadId, user }: Props) {
  const t = useTranslations('component.messages.reply')
  const a11y = useTranslations('a11y')

  const { createReply, isPending } = useReply()

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

  const Component = glass ? GlassView : BlurView

  return (
    <Component style={styles.main}>
      <TextBox
        onChangeText={setValue}
        onSubmitEditing={() => {
          onSubmit()
        }}
        placeholder={t('placeholder')}
        returnKeyType="send"
        style={styles.textBox}
        styleInput={styles.input}
        value={value}
      />

      <IconButton
        accessibilityLabel={a11y('createReply')}
        disabled={isPending}
        onPress={() => {
          onSubmit()
        }}
      >
        {isPending ? (
          <Spinner />
        ) : (
          <Icon name="paper-plane-tilt-fill" size={20} />
        )}
      </IconButton>
    </Component>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: {
    paddingHorizontal: theme.space[4],
  },
  main: {
    borderCurve: 'continuous',
    borderRadius: theme.space[7],
    flexDirection: 'row',
    margin: glass ? theme.space[4] : undefined,
  },
  textBox: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
  },
}))
