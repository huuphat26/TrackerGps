import { forwardRef } from "react"
import { TouchableOpacity, View, Platform } from "react-native"
import { createBottomTabNavigator, BottomTabBarButtonProps } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import SvgIcon from "@/components/SvgIcon"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"

import { MapStack } from "@/screens/Map/MapStack"
import { DevicesStack } from "@/screens/Devices/DevicesStack"
import { SettingsStack } from "@/screens/Settings/SettingsStack"
import { HistoryStack } from "@/screens/History/HistoryStack"

export type MainTabParamList = {
  Map: undefined
  Devices: undefined
  History: undefined
  Alerts: undefined
  Settings: undefined
}

const Tab = createBottomTabNavigator<MainTabParamList>()

const NoRippleTabButton = forwardRef<any, BottomTabBarButtonProps>(
  (
    {
      children,
      onPress,
      onLongPress,
      accessibilityRole,
      accessibilityState,
      accessibilityLabel,
      testID,
      style,
    },
    ref,
  ) => {
    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress || undefined}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        activeOpacity={1}
        style={style}
      >
        {children}
      </TouchableOpacity>
    )
  },
)

export function MainTabNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  const { bottom } = useSafeAreaInsets()

  const renderTabBarIcon = (iconName: any, focused: boolean) => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <SvgIcon icon={iconName} size={spacing.lg} fill={focused ? "#FDD495" : colors.textDim} />
      </View>
    )
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.white as string,
        tabBarInactiveTintColor: colors.textDim as string,

        tabBarButton: (props) => <NoRippleTabButton {...props} />,
        tabBarStyle: {
          height: 68,
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs,
          position: "absolute",
          borderRadius: spacing.md,
          backgroundColor: "transparent",
          bottom: Platform.OS === "android" ? bottom + spacing.sm : bottom + spacing.xxs,
          left: spacing.md,
          right: spacing.md,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          marginHorizontal: 8,
          overflow: "hidden",
        },
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: "rgba(37, 37, 37, 1)",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: spacing.md,
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ focused }) => renderTabBarIcon("Map", focused),
        }}
      />

      <Tab.Screen
        name="Devices"
        component={DevicesStack}
        options={{
          tabBarLabel: "Devices",
          tabBarIcon: ({ focused }) => renderTabBarIcon("Devices", focused),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ focused }) => renderTabBarIcon("TimeLine", focused),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => renderTabBarIcon("Setting", focused),
        }}
      />
    </Tab.Navigator>
  )
}
