import { Stack } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { useShallow } from 'zustand/react/shallow'

import { useListProps } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'
import { FeedTypeColors, FeedTypeIcons } from '~/lib/sort'
import { usePreferences } from '~/stores/preferences'
import { type FeedType } from '~/types/sort'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon/button'
import { CommunityHeader } from '../communities/header'
import { PostList } from '../posts/list'
import { SortIntervalMenu } from '../posts/sort-interval'

type Props = {
  type: FeedType
}

export function DefaultFeed({ type }: Props) {
  const t = useTranslations('component.common.type.type')
  const a11y = useTranslations('a11y')

  const { drawerLeft, drawerSticky } = usePreferences(
    useShallow((state) => ({
      drawerLeft: state.drawerLeft,
      drawerSticky: state.drawerSticky,
    })),
  )

  const { sorting, update } = useSorting('feed', type)

  const listProps = useListProps(true)

  return (
    <>
      <Stack.Title asChild>
        <CommunityHeader
          disabled
          image={
            <Icon
              name={FeedTypeIcons[type]}
              uniProps={(theme) => ({
                color: theme.colors[FeedTypeColors[type]].accent,
              })}
            />
          }
          name={t(type)}
        />
      </Stack.Title>

      <Stack.Toolbar placement={iPad ? 'right' : drawerLeft ? 'right' : 'left'}>
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

      {iPad ? (
        drawerSticky ? null : (
          <Stack.Toolbar placement="left">
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
        )
      ) : (
        <Stack.Toolbar placement={drawerLeft ? 'left' : 'right'}>
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
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
}))
