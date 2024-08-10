import { forwardRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useKeyboard } from '~/hooks/keyboard'
import { usePostReply } from '~/hooks/mutations/posts/reply'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Spinner } from '../common/spinner'
import { Text } from '../common/text'

type Props = {
  commentId?: string
  onReset: () => void
  postId?: string
  user?: string
}

export const PostReplyCard = forwardRef<TextInput, Props>(
  function PostReplyCard({ commentId, onReset, postId, user }, ref) {
    const insets = useSafeAreaInsets()

    const t = useTranslations('component.posts.reply')

    const keyboard = useKeyboard()

    const { styles, theme } = useStyles(stylesheet)

    const { isPending, reply } = usePostReply()

    const [focused, setFocused] = useState(false)
    const [text, setText] = useState('')

    return (
      <Animated.View style={[styles.main, keyboard.styles]}>
        <TextInput
          editable={!isPending}
          multiline
          onBlur={() => {
            setFocused(false)
          }}
          onChangeText={setText}
          onFocus={() => {
            setFocused(true)
          }}
          placeholder={t('placeholder')}
          placeholderTextColor={theme.colors.gray.a9}
          ref={ref}
          selectionColor={theme.colors.accent.a9}
          style={styles.input(insets.bottom, focused)}
          textAlignVertical="top"
          value={text}
        />

        {focused ? (
          <View style={styles.footer}>
            {user ? (
              <Pressable onPress={onReset} style={styles.reset}>
                <Icon
                  color={theme.colors.red.a11}
                  name="X"
                  size={theme.typography[2].lineHeight}
                  weight="fill"
                />

                <Text size="2">
                  {t('comment', {
                    user,
                  })}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              disabled={!postId || isPending}
              onPress={() => {
                if (!postId || text.length === 0) {
                  return
                }

                reply({
                  commentId,
                  postId,
                  text,
                })

                setText('')
                onReset()
              }}
              style={styles.button}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <Text color={postId ? 'accent' : 'gray'} weight="bold">
                  {t('submit')}
                </Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </Animated.View>
    )
  },
)

const stylesheet = createStyleSheet((theme) => ({
  button: {
    marginLeft: 'auto',
    padding: theme.space[4],
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[4],
  },
  input: (inset: number, open: boolean) => ({
    color: theme.colors.gray.contrast,
    fontSize: theme.typography[3].fontSize,
    height: open ? theme.space[9] * 2 : undefined,
    lineHeight: theme.typography[3].lineHeight,
    padding: theme.space[3],
    paddingBottom: (open ? 0 : inset) + theme.space[4],
  }),
  main: {
    backgroundColor: theme.colors.gray.a3,
  },
  reset: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
    padding: theme.space[4],
  },
}))
