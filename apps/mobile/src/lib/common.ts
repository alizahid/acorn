import { Dimensions } from 'react-native'

import { iPad } from './const'

const height = Dimensions.get('window').height

export const listProps = {
  drawDistance: height * (iPad ? 3 : 2),
  onEndReachedThreshold: 3,
  scrollIndicatorInsets: {
    bottom: 1,
    right: 1,
    top: 1,
  },
} as const
