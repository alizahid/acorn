import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router'
import { useCallback, useState } from 'react'
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { TextInput } from '~/components/native/text-input'
import { useCommentEdit } from '~/hooks/mutations/comments/edit'
import { usePostReply } from '~/hooks/mutations/posts/reply'
import { htmlToMarkdown } from '~/lib/editor'
import { type Font, fonts } from '~/lib/fonts'
import { usePreferences } from '~/stores/preferences'

const schema = z.object({
  body: z.string().optional(),
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
  postId: z.string().optional(),
  user: z.string().optional(),
})

export default function Screen() {
  const router = useRouter()
  const navigation = useNavigation()

  const params = schema.parse(useLocalSearchParams())

  const { font, fontScaling, systemScaling } = usePreferences()

  const t = useTranslations('screen.posts.reply')
  const a11y = useTranslations('a11y')

  const keyboard = useAnimatedKeyboard()

  const reply = usePostReply()
  const edit = useCommentEdit()

  const [text, setText] = useState(
    params.body ? htmlToMarkdown(params.body) : '',
  )

  const style = useAnimatedStyle(() => ({
    paddingBottom: keyboard.height.get(),
  }))

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <IconButton
            icon="paperplane.fill"
            label={a11y('createComment')}
            loading={reply.isPending || edit.isPending}
            onPress={async () => {
              if (text.length === 0) {
                return
              }

              if (params.body && params.commentId) {
                if (params.body !== text) {
                  await edit.edit({
                    body: text,
                    id: params.commentId,
                    postId: params.postId,
                  })
                }

                router.back()

                return
              }

              await reply.reply({
                commentId: params.commentId,
                postId: params.id,
                text,
              })

              router.back()
            }}
          />
        ),
      })
    }, [
      a11y,
      edit,
      navigation,
      params.body,
      params.commentId,
      params.id,
      params.postId,
      reply,
      router,
      text,
    ]),
  )

  return (
    <Animated.View style={[styles.main, style]}>
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
        allowFontScaling={systemScaling}
        autoFocus
        multiline
        onChangeText={setText}
        placeholder={t('placeholder')}
        style={styles.input(font, fontScaling)}
        value={text}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create((theme) => ({
  input: (font: Font, scaling: number) => ({
    color: theme.colors.gray.text,
    flex: 1,
    fontFamily: fonts[font],
    fontSize: theme.typography[3].fontSize * scaling,
    lineHeight: theme.typography[3].lineHeight * scaling,
    padding: theme.space[3],
  }),
  main: {
    flex: 1,
  },
  user: {
    backgroundColor: theme.colors.gray.ui,
  },
}))
