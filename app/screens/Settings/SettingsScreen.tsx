import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import MapView from "react-native-maps"
import MapViewScreen from "../Map/MapScreen"
import { Text } from "@/components/Text"

interface SettingsScreenProps {}
const SettingsScreen: FC<SettingsScreenProps> = () => {
  const {
    theme: { colors, spacing },
    themed,
  } = useAppTheme()
  return (
    <View style={themed($container)}>
      <Text preset="default" text="SettingsScreen Screen" />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

export default SettingsScreen
