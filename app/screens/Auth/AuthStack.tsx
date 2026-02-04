import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SigninScreen from "./SigninScreen"
import SignupScreen from "./SignupScreen"

export type AuthStackParamList = {
  SigninScreen: undefined
  SignupScreen: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  )
}
