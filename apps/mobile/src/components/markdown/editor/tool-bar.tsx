import { type RefObject } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import {
  KeyboardController,
  useKeyboardState,
} from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'

type Props = {
  editor?: RefObject<EnrichedMarkdownTextInputInstance | null>
  state?: StyleState
  style?: StyleProp<ViewStyle>
}

export function EditorToolBar({ editor, state, style }: Props) {
  const a11y = useTranslations('a11y')

  const visible = useKeyboardState(({ isVisible }) => isVisible)

  return (
    <View style={[styles.main, style]}>
      <IconButton
        accessibilityLabel={a11y('toggleBold')}
        onPress={() => {
          editor?.current?.toggleBold()
        }}
      >
        <Icon
          name={state?.bold.isActive ? 'text-b-bold' : 'text-b'}
          uniProps={(theme) => ({
            color: state?.bold.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleItalic')}
        onPress={() => {
          editor?.current?.toggleItalic()
        }}
      >
        <Icon
          name={state?.italic.isActive ? 'text-italic-bold' : 'text-italic'}
          uniProps={(theme) => ({
            color: state?.italic.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleStrikethrough')}
        onPress={() => {
          editor?.current?.toggleStrikethrough()
        }}
      >
        <Icon
          name={
            state?.strikethrough.isActive
              ? 'text-strikethrough-bold'
              : 'text-strikethrough'
          }
          uniProps={(theme) => ({
            color: state?.strikethrough.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      <IconButton
        accessibilityLabel={a11y('toggleSpoiler')}
        onPress={() => {
          editor?.current?.toggleSpoiler()
        }}
      >
        <Icon
          name={state?.spoiler.isActive ? 'eye-closed-bold' : 'eye-closed'}
          uniProps={(theme) => ({
            color: state?.spoiler.isActive
              ? theme.colors.accent.accent
              : theme.colors.gray.textLow,
          })}
        />
      </IconButton>

      {visible ? (
        <IconButton
          accessibilityLabel={a11y('dismissKeyboard')}
          onPress={() => {
            KeyboardController.dismiss()
          }}
          style={styles.dismiss}
        >
          <Icon
            name="caret-down"
            uniProps={(theme) => ({
              color: theme.colors.gray.textLow,
            })}
          />
        </IconButton>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  dismiss: {
    marginLeft: 'auto',
  },

  main: {
    flexDirection: 'row',
  },
})
