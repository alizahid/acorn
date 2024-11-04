import { SheetManager } from 'react-native-actions-sheet'
import { useStyles } from 'react-native-unistyles'

import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type FeedTypeSheetReturnValue } from '~/sheets/feed-type'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  onChange: (data: FeedTypeSheetReturnValue) => void
  type: FeedType
}

export function FeedTypeMenu({ onChange, type }: Props) {
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      height="8"
      onPress={() => {
        void SheetManager.show('feed-type', {
          onClose(data) {
            if (data) {
              onChange(data)
            }
          },
          payload: {
            type,
          },
        })
      }}
      px="3"
    >
      <Icon
        color={theme.colors[FeedTypeColors[type]].a9}
        name={FeedTypeIcons[type]}
        size={theme.space[5]}
        weight="duotone"
      />

      <Icon
        color={theme.colors.gray.a11}
        name="CaretDown"
        size={theme.space[4]}
        weight="bold"
      />
    </Pressable>
  )
}
