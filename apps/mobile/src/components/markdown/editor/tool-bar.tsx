import { type RefObject } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import {
  type EnrichedMarkdownTextInputInstance,
  type StyleState,
} from 'react-native-enriched-markdown'
import { ScrollView } from 'react-native-gesture-handler'
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
      <ScrollView horizontal>
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
          accessibilityLabel={a11y('toggleHeading')}
          onPress={() => {
            editor?.current?.toggleHeading(1)
          }}
        >
          <Icon
            name={state?.heading.isActive ? 'text-h-bold' : 'text-h'}
            uniProps={(theme) => ({
              color: state?.heading.isActive
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
            name={state?.spoiler.isActive ? 'eye-slash-bold' : 'eye-slash'}
            uniProps={(theme) => ({
              color: state?.spoiler.isActive
                ? theme.colors.accent.accent
                : theme.colors.gray.textLow,
            })}
          />
        </IconButton>

        <IconButton
          accessibilityLabel={a11y('toggleOrderedList')}
          onPress={() => {
            editor?.current?.toggleOrderedList()
          }}
        >
          <Icon
            name={
              state?.orderedList.isActive ? 'list-numbers-bold' : 'list-numbers'
            }
            uniProps={(theme) => ({
              color: state?.orderedList.isActive
                ? theme.colors.accent.accent
                : theme.colors.gray.textLow,
            })}
          />
        </IconButton>

        <IconButton
          accessibilityLabel={a11y('toggleUnorderedList')}
          onPress={() => {
            editor?.current?.toggleUnorderedList()
          }}
        >
          <Icon
            name={
              state?.unorderedList.isActive
                ? 'list-bullets-bold'
                : 'list-bullets'
            }
            uniProps={(theme) => ({
              color: state?.unorderedList.isActive
                ? theme.colors.accent.accent
                : theme.colors.gray.textLow,
            })}
          />
        </IconButton>
      </ScrollView>

      {visible ? (
        <IconButton
          accessibilityLabel={a11y('dismissKeyboard')}
          onPress={() => {
            KeyboardController.dismiss()
          }}
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
  main: {
    flexDirection: 'row',
  },
})
