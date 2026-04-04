import { useReorderableDrag } from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { PhosphorIcon } from '../common/icon/phosphor'
import { Pressable } from '../common/pressable'
import { Switch } from '../common/switch'
import { Text } from '../common/text'

type Props = {
  disabled?: boolean
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
}

export function DraggableItem({ disabled, label, onChange, value }: Props) {
  const a11y = useTranslations('a11y')

  const drag = useReorderableDrag()

  return (
    <Pressable
      accessibilityHint={a11y('drag')}
      accessibilityLabel={label}
      onLongPress={drag}
      style={styles.main}
      variant="plain"
    >
      <PhosphorIcon
        name="DotsSixVertical"
        uniProps={(theme) => ({
          color: theme.colors.gray.accent,
          size: theme.space[4],
        })}
        weight="bold"
      />

      <Text style={styles.label} weight="medium">
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
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    height: theme.space[8],
    paddingHorizontal: theme.space[3],
  },
}))
