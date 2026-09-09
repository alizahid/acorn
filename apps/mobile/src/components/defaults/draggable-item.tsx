import { type StyleProp, View, type ViewStyle } from 'react-native'
import { useReorderableDrag } from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Switch } from '../common/switch'
import { Text } from '../common/text'

type Props = {
  disabled?: boolean
  label: string
  onChange?: (value: boolean) => void
  style?: StyleProp<ViewStyle>
  value?: boolean
}

export function DraggableItem({
  disabled,
  label,
  onChange,
  style,
  value,
}: Props) {
  const a11y = useTranslations('a11y')

  const drag = useReorderableDrag()

  return (
    <Pressable
      accessibilityHint={a11y('drag')}
      accessibilityLabel={label}
      disabled={disabled}
      onLongPress={drag}
      style={style}
      variant="plain"
    >
      <View style={styles.side}>
        <Icon
          name="dots-six-vertical-bold"
          uniProps={(theme) => ({
            color: theme.colors.gray.accent,
            size: theme.space[4],
          })}
        />
      </View>

      <Text numberOfLines={1} size="2" style={styles.label} weight="medium">
        {label}
      </Text>

      {onChange ? (
        <Switch
          disabled={disabled}
          label={label}
          onChange={(next) => {
            onChange(next)
          }}
          value={value}
        />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  label: {
    flex: 1,
  },
  side: {
    alignItems: 'center',
    flexDirection: 'row',
    height: theme.space[7],
    justifyContent: 'center',
    width: theme.space[7],
  },
}))
