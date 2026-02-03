import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"

interface DevicesScreenProps {}
const DevicesScreen: FC<DevicesScreenProps> = () => {
  const {
    theme: { colors, spacing },
    themed,
  } = useAppTheme()
  return (
    <View style={themed($container)}>
      <Header title="Devices" />
      <Text preset="default" text="Devices Screen" />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
})

export default DevicesScreen
