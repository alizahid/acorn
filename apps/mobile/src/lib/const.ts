import { Platform } from 'react-native'

export const cardMaxWidth = 600

export const iPhone = Platform.OS === 'ios' && !Platform.isPad

export const iPad = Platform.OS === 'ios' && Platform.isPad
