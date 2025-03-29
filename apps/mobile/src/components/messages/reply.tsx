import { useState } from 'react'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useReply } from '~/hooks/mutations/messages/reply'

import { IconButton } from '../common/icon-button'
import { TextBox } from '../common/text-box'
import { View } from '../common/view'

type Props = {
  id: string
  user: string
}

export function ReplyCard({ id, user }: Props) {
  const t = useTranslations('component.messages.reply')

  const { styles } = useStyles(stylesheet)

  const { createReply, isPending } = useReply()

  const [text, setText] = useState('')

  return (
    <View direction="row" style={styles.main}>
      <TextBox
        multiline
        onChangeText={setText}
        placeholder={t('placeholder')}
        style={styles.input}
        styleContent={styles.content}
        value={text}
      />

      <IconButton
        icon={{
          name: 'PaperPlaneTilt',
        }}
        loading={isPending}
        onPress={() => {
          if (text.length === 0) {
            return
          }

          createReply({
            id,
            text,
            user,
          })

          setText('')
        }}
        style={styles.submit}
      />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
  },
  input: {
    flex: 1,
    maxHeight: 300,
  },
  main: {
    backgroundColor: theme.colors.gray.ui,
    borderCurve: 'continuous',
    borderTopLeftRadius: theme.radius[4],
    borderTopRightRadius: theme.radius[4],
  },
  submit: {
    alignSelf: 'flex-end',
  },
}))
