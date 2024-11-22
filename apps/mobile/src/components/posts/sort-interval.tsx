import { SymbolView } from 'expo-symbols'
import { ContextMenuButton } from 'react-native-ios-context-menu'
import { useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { menu } from '~/assets/menu'
import { IntervalIcons, SortColors, SortIcons } from '~/lib/sort'
import {
  CommentSort,
  CommunityFeedSort,
  FeedSort,
  type PostSort,
  SearchSort,
  type SortType,
  TopInterval,
  UserFeedSort,
} from '~/types/sort'

import { Icon } from '../common/icon'
import { View } from '../common/view'

export type SortIntervalMenuData<Type extends SortType> = {
  interval?: TopInterval
  sort: Type extends 'comment'
    ? CommentSort
    : Type extends 'community'
      ? CommunityFeedSort
      : Type extends 'search'
        ? SearchSort
        : Type extends 'user'
          ? UserFeedSort
          : FeedSort
}

type Props<Type extends SortType> = SortIntervalMenuData<Type> & {
  onChange: (data: SortIntervalMenuData<Type>) => void
  type: Type
}

export function SortIntervalMenu<Type extends SortType>({
  interval,
  onChange,
  sort,
  type,
}: Props<Type>) {
  const t = useTranslations('component.common')

  const { theme } = useStyles()

  const items =
    type === 'comment'
      ? CommentSort
      : type === 'community'
        ? CommunityFeedSort
        : type === 'search'
          ? SearchSort
          : type === 'user'
            ? UserFeedSort
            : FeedSort

  return (
    <ContextMenuButton
      menuConfig={{
        menuItems: items.map((item) => ({
          actionKey: item,
          actionTitle: t(`sort.${item}`),
          icon: {
            imageOptions: {
              tint: theme.colors[SortColors[item]][9],
            },
            imageValue: menu[icons[item]],
            type: 'IMAGE_REQUIRE',
          },
          menuItems:
            item === 'top'
              ? TopInterval.map((itemInterval) => ({
                  actionKey: itemInterval,
                  actionTitle: t(`interval.${itemInterval}`),
                  icon: {
                    iconTint: theme.colors.gold[9],
                    iconType: 'SYSTEM',
                    iconValue: IntervalIcons[itemInterval],
                  },
                }))
              : undefined,
          menuTitle: item === 'top' ? t('sort.top') : undefined,
        })),
        menuTitle: t('sort.title'),
      }}
      onPressMenuItem={(event) => {
        const value = event.nativeEvent.actionKey

        type Sort = Type extends 'comment'
          ? CommentSort
          : Type extends 'community'
            ? CommunityFeedSort
            : Type extends 'search'
              ? SearchSort
              : Type extends 'user'
                ? UserFeedSort
                : FeedSort

        if (TopInterval.includes(value as TopInterval)) {
          onChange({
            interval: value as TopInterval,
            sort: 'top' as Sort,
          })

          return
        }

        onChange({
          sort: value as Sort,
        })
      }}
    >
      <View
        align="center"
        direction="row"
        gap="2"
        height="8"
        justify="end"
        px="3"
      >
        <Icon
          color={theme.colors[SortColors[sort]].a9}
          name={SortIcons[sort]}
          size={theme.space[5]}
          weight="duotone"
        />

        {sort === 'top' && interval ? (
          <SymbolView
            name={IntervalIcons[interval]}
            size={20}
            tintColor={theme.colors.gold.a9}
          />
        ) : null}

        <Icon
          color={theme.colors.gray.a11}
          name="CaretDown"
          size={theme.space[4]}
          weight="bold"
        />
      </View>
    </ContextMenuButton>
  )
}

const icons: Record<PostSort, keyof typeof menu> = {
  best: 'medal',
  comments: 'chatCircle',
  confidence: 'medal',
  controversial: 'flame',
  hot: 'flame',
  new: 'clock',
  old: 'package',
  relevance: 'target',
  rising: 'chartLineUp',
  top: 'ranking',
}
