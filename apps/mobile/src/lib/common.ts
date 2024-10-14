import { Dimensions, Platform } from 'react-native'

const height = Dimensions.get('window').height

export const cardMaxWidth = 600

export const iPhone = Platform.OS === 'ios' && !Platform.isPad

export const iPad = Platform.OS === 'ios' && Platform.isPad

export const listProps = {
  drawDistance: height * (iPad ? 3 : 2),
  onEndReachedThreshold: 3,
  scrollIndicatorInsets: {
    bottom: 1,
    right: 1,
    top: 1,
  },
} as const
