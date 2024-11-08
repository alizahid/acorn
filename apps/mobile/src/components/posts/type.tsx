import { Image } from 'expo-image'
import { SheetManager } from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useFeeds } from '~/hooks/queries/feeds/feeds'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type FeedTypeSheetReturnValue } from '~/sheets/feed-type'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { Pressable } from '../common/pressable'

type Props = {
  feed?: string
  onChange: (data: FeedTypeSheetReturnValue) => void
  type: FeedType
}

export function FeedTypeMenu({ feed, onChange, type }: Props) {
  const { styles, theme } = useStyles(stylesheet)

  const { feeds } = useFeeds()

  const image = feeds.find((item) => item.id === feed)?.image

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
            feed,
            type,
          },
        })
      }}
      px="3"
    >
      {image ? (
        <Image source={image} style={styles.image} />
      ) : (
        <Icon
          color={theme.colors[FeedTypeColors[type]].a9}
          name={FeedTypeIcons[type]}
          size={theme.space[5]}
          weight="duotone"
        />
      )}

      <Icon
        color={theme.colors.gray.a11}
        name="CaretDown"
        size={theme.space[4]}
        weight="bold"
      />
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    height: theme.space[5],
    width: theme.space[5],
  },
}))
