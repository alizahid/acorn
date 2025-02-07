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

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator

export const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator)
