import { type StyleProp, type ViewStyle } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import { useStyles } from 'react-native-unistyles'

import { SortColors, SortIcons } from '~/lib/sort'
import { type PostSortSheetReturnValue } from '~/sheets/post-sort'
import { type PostSort, type SortType, type TopInterval } from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'
import { TopIntervalItem } from './interval'

type Props = {
  interval?: TopInterval
  onChange: (data: PostSortSheetReturnValue) => void
  sort: PostSort
  style?: StyleProp<ViewStyle>
  type: SortType
}

export function SortIntervalMenu({
  interval,
  onChange,
  sort,
  style,
  type,
}: Props) {
  const { theme } = useStyles()

  return (
    <Pressable
      align="center"
      direction="row"
      gap="2"
      height="8"
      justify="end"
      onPress={() => {
        void SheetManager.show('post-sort', {
          onClose(data) {
            if (data) {
              onChange(data)
            }
          },
          payload: {
            interval,
            sort,
            type,
          },
        })
      }}
      px="3"
      style={style}
    >
      <Icon
        color={theme.colors[SortColors[sort]].a9}
        name={SortIcons[sort]}
        size={theme.space[5]}
        weight="duotone"
      />

      {sort === 'top' && interval ? (
        <TopIntervalItem interval={interval} size={20} />
      ) : null}

      <Icon
        color={theme.colors.gray.a11}
        name="CaretDown"
        size={theme.space[4]}
        weight="bold"
      />
    </Pressable>
  )
}
