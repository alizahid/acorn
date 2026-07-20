import { Stack } from 'expo-router'
import { PlatformColor } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { IconButton } from '~/components/common/icon/button'
import { PostList } from '~/components/posts/list'
import { SortIntervalMenu } from '~/components/posts/sort-interval'
import { useListProps } from '~/hooks/list'
import { useSorting } from '~/hooks/sorting'
import { glass, iPad } from '~/lib/common'
import { mitter } from '~/lib/mitt'

type Props = {
  name: string
}

export function CommunityFeed({ name }: Props) {
  const a11y = useTranslations('a11y')

  styles.useVariants({
    iPad,
  })

  const { sorting, update } = useSorting('community', name)

  const listProps = useListProps(true)

  return (
    <>
      <Stack.Title style={styles.title}>{name}</Stack.Title>

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View>
          <SortIntervalMenu
            interval={sorting.interval}
            onChange={(next) => {
              update(next)
            }}
            sort={sorting.sort}
            style={styles.sort}
            type="community"
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
        community={name}
        interval={sorting.interval}
        listProps={listProps}
        sort={sorting.sort}
        style={styles.list}
      />
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  list: {
    variants: {
      iPad: {
        true: {
          paddingHorizontal: theme.space[4],
        },
      },
    },
  },
  sort: {
    gap: theme.space[1],
    paddingHorizontal: glass ? theme.space[1] : 0,
  },
  title: {
    color: PlatformColor('labelColor'),
  },
}))
