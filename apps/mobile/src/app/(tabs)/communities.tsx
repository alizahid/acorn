import { useFocusEffect, useNavigation } from 'expo-router'
import React, { useRef } from 'react'
import Pager from 'react-native-pager-view'
import { useSharedValue } from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { CommunitiesHeader } from '~/components/communities/header'
import { CommunitiesList } from '~/components/communities/list'
import { type Insets, useCommon } from '~/hooks/common'
import { useCommunities } from '~/hooks/queries/communities/communities'

export default function Screen() {
  const navigation = useNavigation()

  const common = useCommon()

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  const offset = useSharedValue(0)

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    users,
  } = useCommunities()

  useFocusEffect(() => {
    navigation.setOptions({
      header: () => (
        <CommunitiesHeader
          offset={offset}
          onChange={(next) => {
            pager.current?.setPage(next)
          }}
        />
      ),
    })
  })

  const props = {
    fetchNextPage,
    hasNextPage,
    insets: [] satisfies Insets,
    isFetchingNextPage,
    isLoading,
    refetch,
  } as const

  return (
    <Pager
      onPageScroll={(event) => {
        offset.value = event.nativeEvent.offset + event.nativeEvent.position
      }}
      ref={pager}
      style={styles.main(common.height.communities, common.height.tabBar)}
    >
      <CommunitiesList {...props} communities={communities} key="posts" />

      <CommunitiesList {...props} communities={users} key="communities" />
    </Pager>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (top: number, bottom: number) => ({
    flex: 1,
    marginBottom: bottom - theme.space[2],
    marginTop: top - theme.space[2],
  }),
}))
