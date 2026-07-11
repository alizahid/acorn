import {
  createNativeBottomTabNavigator,
  type NativeBottomTabNavigationEventMap,
  type NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation'
import { type TabNavigationState, withLayoutContext } from 'expo-router'
import { type ParamListBase } from 'expo-router/react-navigation'

const { Navigator } = createNativeBottomTabNavigator()

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(Navigator)
