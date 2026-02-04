import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import HistoryScreen from "./HistoryScreen"
import HistoryMapScreen from "./HistoryMapScreen"

export type HistoryStackParamList = {
  HistoryScreen: { deviceId?: string } | undefined
  HistoryMapScreen: { deviceId?: string } | undefined
}

const Stack = createNativeStackNavigator<HistoryStackParamList>()

export const HistoryStack = () => {
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
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="HistoryMapScreen" component={HistoryMapScreen} />
    </Stack.Navigator>
  )
}
