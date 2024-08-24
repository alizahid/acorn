import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import Pager from 'react-native-pager-view'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { z } from 'zod'

import { CommunitiesList } from '~/components/communities/list'
import { type Insets, useCommon } from '~/hooks/common'
import { useCommunities } from '~/hooks/queries/communities/communities'
import { CommunitiesType } from '~/types/community'

const schema = z.object({
  type: z.enum(CommunitiesType).catch('communities'),
})

export default function Screen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const common = useCommon()

  const pager = useRef<Pager>(null)

  const { styles } = useStyles(stylesheet)

  const type = params.type

  useEffect(() => {
    const index = CommunitiesType.indexOf(type)

    pager.current?.setPage(index)
  }, [type])

  const {
    communities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    users,
  } = useCommunities()

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
      initialPage={0}
      onPageSelected={(event) => {
        router.setParams({
          type: CommunitiesType[event.nativeEvent.position],
        })
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
