import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LiveMapScreen from "./LiveMapScreen"

export type MapStackParamList = {
  LiveMapScreen: { deviceId?: string } | undefined
}

const Stack = createNativeStackNavigator<MapStackParamList>()

export const MapStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LiveMapScreen" component={LiveMapScreen} />
    </Stack.Navigator>
  )
}
