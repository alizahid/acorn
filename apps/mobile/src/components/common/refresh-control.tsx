import { useCallback, useState } from 'react'
import { RefreshControl as ReactNativeRefreshControl } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { type ColorName } from '~/styles/colors'

type Props = {
  color?: ColorName
  onRefresh: () => Promise<unknown>
}

export function RefreshControl({ color = 'accent', onRefresh }: Props) {
  const { theme } = useStyles()

  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)

    await onRefresh()

    setRefreshing(false)
  }, [onRefresh])

  return (
    <ReactNativeRefreshControl
      colors={[theme.colors[color][9], theme.colors[color][10]]}
      onRefresh={refresh}
      refreshing={refreshing}
      tintColor={theme.colors[color][9]}
    />
  )
}
