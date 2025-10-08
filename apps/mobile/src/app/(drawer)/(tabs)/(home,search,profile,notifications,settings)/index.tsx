import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useList } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { useStageManager } from '~/hooks/stage-manager'
import { iPad } from '~/lib/common'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { useDefaults } from '~/stores/defaults'
import { usePreferences } from '~/stores/preferences'
import { FeedType } from '~/types/sort'

const schema = z.object({
  feed: z.string().optional(),
  type: z.enum(FeedType).catch(useDefaults.getState().feedType),
})

export type HomeParams = z.infer<typeof schema>

export default function Screen() {
  const navigation = useNavigation()
  const params = schema.parse(useLocalSearchParams())

  const a11y = useTranslations('a11y')
  const tType = useTranslations('component.common.type.type')

  const { stickyDrawer } = usePreferences()

  const stageManager = useStageManager()

  const listProps = useList()

  styles.useVariants({
    iPad,
  })

  const type = params.type === 'home' ? 'feed' : 'community'

  const { sorting, update } = useSorting(type, params.feed ?? params.type)

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft:
          iPad && !stageManager && stickyDrawer
            ? null
            : () => (
                <IconButton
                  icon="sidebar.leading"
                  label={a11y('toggleSidebar')}
                  onPress={() => {
                    // @ts-expect-error
                    navigation.toggleDrawer()
                  }}
                />
              ),
        headerRight: () => (
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              update(next)
            }}
            sort={sorting.sort}
            type={type}
          />
        ),
        headerTitle: params.feed
          ? null
          : () => (
              <View align="center" direction="row" gap="2">
                <Icon
                  name={FeedTypeIcons[params.type]}
                  uniProps={(theme) => ({
                    tintColor: theme.colors[FeedTypeColors[params.type]].accent,
                  })}
                />

                <Text weight="bold">{tType(params.type)}</Text>
              </View>
            ),
        title: params.feed,
      })
    }, [
      a11y,
      navigation.setOptions,
      // @ts-expect-error
      navigation.toggleDrawer,
      params.feed,
      params.type,
      sorting.interval,
      sorting.sort,
      stickyDrawer,
      tType,
      type,
      update,
      stageManager,
    ]),
  )

  return (
    <PostList
      community={params.type === 'home' ? undefined : params.type}
      feed={params.feed}
      interval={sorting.interval}
      listProps={listProps}
      sort={sorting.sort}
      style={styles.list}
    />
  )
}

const styles = StyleSheet.create((theme) => ({
  list: {
    variants: {
      iPad: {
        true: {
          padding: theme.space[4],
        },
      },
    },
  },
}))
