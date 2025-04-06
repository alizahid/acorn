import {
  createNativeBottomTabNavigator,
  type NativeBottomTabNavigationEventMap,
  type NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation'
import {
  type ParamListBase,
  type TabNavigationState,
} from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'

const { Navigator } = createNativeBottomTabNavigator()

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(Navigator)
