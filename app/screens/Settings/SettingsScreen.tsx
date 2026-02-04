import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useState } from "react"
import { View, ViewStyle, ScrollView } from "react-native"
import { Header } from "@/components/Header"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Components
import { AccountSection } from "./components/AccountSection"
import { MapLayerSection } from "./components/MapLayerSection"
import { AlertSettingsSection } from "./components/AlertSettingsSection"
import { InformationSection } from "./components/InformationSection"

interface SettingsScreenProps {}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const navigation = useNavigation()
  const {
    themed,
    theme: { spacing },
  } = useAppTheme()
  const insets = useSafeAreaInsets()

  const [mapType, setMapType] = useState<"satellite" | "traffic" | "terrain">("traffic")
  const [speedingAlert, setSpeedingAlert] = useState(true)
  const [geofenceAlert, setGeofenceAlert] = useState(true)

  return (
    <View style={[themed($container), { paddingBottom: insets.bottom + spacing.xxxl }]}>
      <Header
        title="Settings"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        style={themed($header)}
      />

      <ScrollView
        contentContainerStyle={themed($scrollContent)}
        showsVerticalScrollIndicator={false}
      >
        <AccountSection />

        <MapLayerSection mapType={mapType} onSetMapType={setMapType} />

        <AlertSettingsSection
          speedingAlert={speedingAlert}
          onToggleSpeeding={setSpeedingAlert}
          geofenceAlert={geofenceAlert}
          onToggleGeofence={setGeofenceAlert}
        />

        <InformationSection />
      </ScrollView>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral200,
})

const $header: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

export default SettingsScreen
