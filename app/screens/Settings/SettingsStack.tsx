import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import SettingsScreen from "./SettingsScreen"

export type SettingsStackParamList = {
  SettingsScreen: undefined
}

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export const SettingsStack = () => {
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
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  )
}
