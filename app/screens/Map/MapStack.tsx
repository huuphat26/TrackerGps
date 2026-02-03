import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { useAppTheme } from "@/theme/context"
import MapScreen from "./MapScreen"

export type MapStackParamList = {
  MapScreen: undefined
}

const Stack = createNativeStackNavigator<MapStackParamList>()

export const MapStack = () => {
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
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  )
}
