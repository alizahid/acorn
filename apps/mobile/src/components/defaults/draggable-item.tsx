import { useReorderableDrag } from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Switch } from '../common/switch'
import { Text } from '../common/text'

type Props = {
  label: string
  onChange?: (value: boolean) => void
  value?: boolean
}

export function DraggableItem({ label, onChange, value }: Props) {
  const drag = useReorderableDrag()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      gap="3"
      height="8"
      label={label}
      onLongPress={drag}
      px="3"
    >
      <Icon
        color={theme.colors.gray.accent}
        name="DotsSixVertical"
        size={theme.space[4]}
        weight="bold"
      />

      <Text style={styles.label} weight="medium">
        {label}
      </Text>

      {onChange ? (
        <Switch
          onChange={(next) => {
            onChange(next)
          }}
          value={value}
        />
      ) : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet(() => ({
  label: {
    flex: 1,
  },
}))
