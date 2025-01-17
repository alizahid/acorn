import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { TextInput } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { KeyboardHeight } from '~/components/common/keyboard-height'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { HeaderButton } from '~/components/navigation/header-button'
import { usePostReply } from '~/hooks/mutations/posts/reply'
import { iPad, iPhone } from '~/lib/common'
import { fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
  user: z.string().optional(),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { fontScaling, fontSystem } = usePreferences()

  const t = useTranslations('screen.posts.reply')

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
        />
      ),
    })
  })

  return (
    <View style={styles.main}>
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
        placeholderTextColor={theme.colors.gray.accent}
        selectionColor={theme.colors.accent.accent}
        style={styles.input(fontSystem)}
        value={text}
      />

      <KeyboardHeight enabled />
    </View>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  input: (systemFont: boolean) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: systemFont ? fonts.system : fonts.sans,
    fontSize: theme.typography[3].fontSize,
    lineHeight: theme.typography[3].lineHeight,
    padding: theme.space[3],
  }),
  main: {
    flex: 1,
    paddingTop: iPad ? theme.space[8] + runtime.insets.top : 0,
  },
  spinner: {
    height: theme.typography[3].lineHeight,
  },
  submit: {
    backgroundColor: theme.colors.accent.accent,
    borderRadius: 0,
    paddingTop: theme.space[3],
  },
  user: {
    backgroundColor: theme.colors.gray.ui,
  },
}))
