import { Stack } from 'expo-router'
import { PlatformColor } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { useListProps } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { Text } from '../common/text'
import { GlassView } from '../native/glass-view'
import { PostList } from '../posts/list'
import { SortIntervalMenu } from '../posts/sort-interval'

type Props = {
  type: FeedType
}

export function DefaultFeed({ type }: Props) {
  const t = useTranslations('component.common.type.type')
  const a11y = useTranslations('a11y')

  const { sorting, update } = useSorting('feed', type)

  const listProps = useListProps(true)

  return (
    <>
      <Stack.Title asChild>
        <GlassView style={styles.header}>
          <Icon
            name={FeedTypeIcons[type]}
            uniProps={(theme) => ({
              color: theme.colors[FeedTypeColors[type]].accent,
            })}
          />

          <Text style={styles.title} weight="bold">
            {t(type)}
          </Text>
        </GlassView>
      </Stack.Title>

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View>
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              update(next)
            }}
            sort={sorting.sort}
            style={styles.sort}
            type="feed"
          />
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      {iPad ? null : (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.View>
            <IconButton
              accessibilityLabel={a11y('toggleSidebar')}
              header
              onPress={() => {
                mitter.emit('drawer-toggle')
              }}
            >
              <Icon name="sidebar" />
            </IconButton>
          </Stack.Toolbar.View>
        </Stack.Toolbar>
      )}

      <PostList
        community={type === 'home' ? undefined : type}
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  header: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.space[8],
    flexDirection: 'row',
    gap: theme.space[2],
    height: theme.space[8],
    paddingHorizontal: theme.space[4],
  },
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
  title: {
    color: PlatformColor('labelColor'),
  },
}))
