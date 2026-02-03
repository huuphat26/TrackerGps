import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { View } from "react-native"

export default function AlertsScreen() {
  const {
    theme: { colors, spacing },
  } = useAppTheme()

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={{ flex: 1, padding: spacing.lg }}
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text text="Alerts Coming Soon" />
      </View>
    </Screen>
  )
}
