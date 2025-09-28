import { useReorderableDrag } from 'react-native-reorderable-list'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Pressable } from '../common/pressable'
import { Switch } from '../common/switch'
import { Text } from '../common/text'

type Props = {
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
}

export function DraggableItem({ label, onChange, value }: Props) {
  const a11y = useTranslations('a11y')

  const drag = useReorderableDrag()

  return (
    <Pressable
      accessibilityHint={a11y('drag')}
      accessibilityLabel={label}
      align="center"
      direction="row"
      gap="3"
      height="8"
      onLongPress={drag}
      px="3"
    >
      <Text style={styles.label} weight="medium">
        {label}
      </Text>

      {onChange ? (
        <Switch
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

const styles = StyleSheet.create({
  label: {
    flex: 1,
  },
})
