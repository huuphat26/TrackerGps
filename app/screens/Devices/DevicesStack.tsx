import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import DevicesScreen from "./DevicesScreen"

export type DevicesStackParamList = {
  DevicesScreen: undefined
}

const Stack = createNativeStackNavigator<DevicesStackParamList>()

export const DevicesStack = () => {
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
      <Stack.Screen name="DevicesScreen" component={DevicesScreen} />
    </Stack.Navigator>
  )
}
