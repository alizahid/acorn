import { Pressable } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import {
  ReorderableListItem,
  useReorderableDrag,
} from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Account } from '~/stores/auth'

import { Icon } from '../common/icon'
import { Text } from '../common/text'
import { HeaderButton } from '../navigation/header-button'

type Props = {
  account: Account
  onChange: (id: string) => void
  onClose: () => void
  onRemove: (id: string) => void
  selected?: string
}

export function AccountCard({
  account,
  onChange,
  onClose,
  onRemove,
  selected,
}: Props) {
  const drag = useReorderableDrag()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <ReorderableListItem>
      <Swipeable
        containerStyle={styles.delete}
        key={account.id}
        renderLeftActions={() => (
          <HeaderButton
            contrast
            icon="Trash"
            onPress={() => {
              onRemove(account.id)
            }}
          />
        )}
        renderRightActions={() => null}
      >
        <Pressable
          onLongPress={drag}
          onPress={() => {
            if (account.id !== selected) {
              onChange(account.id)
            }

            onClose()
          }}
          style={[styles.item, account.id === selected && styles.selected]}
        >
          <Icon
            color={theme.colors.gray.accent}
            name="DotsSixVertical"
            size={theme.space[4]}
            weight="bold"
          />

          <Text weight="medium">{account.id}</Text>
        </Pressable>
      </Swipeable>
    </ReorderableListItem>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  delete: {
    backgroundColor: theme.colors.red.accent,
  },
  item: {
    alignItems: 'center',
    backgroundColor: theme.colors.gray.bg,
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  },
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
