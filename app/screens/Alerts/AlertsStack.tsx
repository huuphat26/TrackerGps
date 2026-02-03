import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import AlertsScreen from "./AlertsScreen"

export type AlertsStackParamList = {
  AlertsScreen: undefined
}

const Stack = createNativeStackNavigator<AlertsStackParamList>()

export const AlertsStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: { backgroundColor: colors.background, paddingTop: 0 },
      }}
    >
      <Stack.Screen name="AlertsScreen" component={AlertsScreen} />
    </Stack.Navigator>
  )
}
