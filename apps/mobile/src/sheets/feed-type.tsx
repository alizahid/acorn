import ActionSheet, {
  type SheetDefinition,
  SheetManager,
  type SheetProps,
  useSheetPayload,
} from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { FeedType } from '~/types/sort'

import { SheetHeader } from './header'
import { SheetItem } from './item'

export type FeedTypeSheetPayload = {
  type?: FeedType
}

export type FeedTypeSheetReturnValue = {
  type: FeedType
}

export type FeedTypeSheetDefinition = SheetDefinition<{
  payload: FeedTypeSheetPayload
  returnValue: FeedTypeSheetReturnValue
}>

export function FeedTypeSheet({ sheetId }: SheetProps<'feed-type'>) {
  const { styles, theme } = useStyles(stylesheet)

  const t = useTranslations('component.common.type')

  const { type } = useSheetPayload<'feed-type'>()

  return (
    <ActionSheet
      containerStyle={styles.main}
      gestureEnabled
      id={sheetId}
      indicatorStyle={styles.indicator}
      initialRoute="sort"
      overlayColor={theme.colors.gray.a9}
    >
      <SheetHeader title={t('title')} />

      {FeedType.map((item) => (
        <SheetItem
          icon={{
            color: theme.colors[FeedTypeColors[item]].a9,
            name: FeedTypeIcons[item],
          }}
          key={item}
          label={t(item)}
          onPress={() => {
            void SheetManager.hide('feed-type', {
              payload: {
                type: item,
              },
            })
          }}
          selected={item === type}
        />
      ))}
    </ActionSheet>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  indicator: {
    display: 'none',
  },
  main: {
    backgroundColor: theme.colors.gray[1],
    paddingBottom: theme.space[3] + runtime.insets.bottom,
  },
}))
