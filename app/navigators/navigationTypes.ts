import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { MapStackParamList } from "@/screens/Map/MapStack"
import { DevicesStackParamList } from "@/screens/Devices/DevicesStack"
import { SettingsStackParamList } from "@/screens/Settings/SettingsStack"
import { AlertsStackParamList } from "@/screens/Alerts/AlertsStack"
import { HistoryStackParamList } from "@/screens/History/HistoryStack"
import { MainTabParamList } from "./MainTabNavigator"
import { SplashStackParamList } from "@/screens/Splash/SplashStack"
import { AuthStackParamList } from "@/screens/Auth/AuthStack"

// Demo Tab Navigator types
export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
  MainTab: NavigatorScreenParams<MainTabParamList> | undefined
  Map: NavigatorScreenParams<MapStackParamList>
  History: NavigatorScreenParams<HistoryStackParamList>
  Settings: NavigatorScreenParams<SettingsStackParamList>
  Devices: NavigatorScreenParams<DevicesStackParamList>
  Alerts: NavigatorScreenParams<AlertsStackParamList>
  Splash: NavigatorScreenParams<SplashStackParamList>
  Auth: NavigatorScreenParams<AuthStackParamList>
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}
