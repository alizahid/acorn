import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { usePostReply } from '~/hooks/mutations/posts/reply'
import { iPhone } from '~/lib/common'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
  user: z.string().optional(),
})

export function PostReplyScreen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.posts.reply')

  const { fontScaling } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const { isPending, reply } = usePostReply()

  const [text, setText] = useState('')

  useFocusEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          icon="PaperPlaneTilt"
          loading={isPending}
          onPress={async () => {
            if (text.length === 0) {
              return
            }

            await reply({
              commentId: params.commentId,
              postId: params.id,
              text,
            })

            router.back()
          }}
          weight="fill"
        />
      ),
    })
  })

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.content}
      enabled={iPhone}
      keyboardShouldPersistTaps="handled"
      style={styles.main}
    >
      {iPhone ? <StatusBar style="light" /> : null}

      {params.user ? (
        <View p="4" style={styles.user}>
          <Text weight="medium">
            {t('user', {
              user: params.user,
            })}
          </Text>
        </View>
      ) : null}

      <TextInput
        allowFontScaling={fontScaling}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- go away
        autoFocus
        multiline
        onChangeText={setText}
        placeholder={t('placeholder')}
        placeholderTextColor={theme.colors.gray.a9}
        selectionColor={theme.colors.accent.a9}
        style={styles.input}
        value={text}
      />
    </KeyboardAwareScrollView>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  content: {
    flexGrow: 1,
  },
  input: {
    color: theme.colors.gray.a12,
    flexGrow: 1,
    fontFamily: 'sans',
    fontSize: theme.typography[3].fontSize,
    lineHeight: theme.typography[3].lineHeight,
    padding: theme.space[3],
  },
  main: {
    flex: 1,
  },
  spinner: {
    height: theme.typography[3].lineHeight,
  },
  submit: {
    backgroundColor: theme.colors.accent.a9,
    borderRadius: 0,
    paddingTop: theme.space[3],
  },
  user: {
    backgroundColor: theme.colors.gray.a3,
  },
}))
