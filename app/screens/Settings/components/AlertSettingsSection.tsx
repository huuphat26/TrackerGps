import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { SettingItem } from "./SettingItem"

interface AlertSettingsSectionProps {
  speedingAlert: boolean
  onToggleSpeeding: (v: boolean) => void
  geofenceAlert: boolean
  onToggleGeofence: (v: boolean) => void
}

export const AlertSettingsSection = ({
  speedingAlert,
  onToggleSpeeding,
  geofenceAlert,
  onToggleGeofence,
}: AlertSettingsSectionProps) => {
  const { themed } = useAppTheme()
  return (
    <>
      <Text text="ALERT SETTINGS" style={themed($sectionLabel)} />
      <View style={themed($sectionCard)}>
        <SettingItem
          icon="History"
          title="Speeding"
          subtitle="Notify when exceeding limit"
          value={speedingAlert}
          onToggle={onToggleSpeeding}
          isFirst
          iconBg="#FFF3E0"
          iconColor="#FFAB40"
        />
        <SettingItem
          icon="Map"
          title="Geofence"
          subtitle="Alerts on entry/exit"
          value={geofenceAlert}
          onToggle={onToggleGeofence}
          iconBg="#E3F2FD"
          iconColor="#448AFF"
        />
      </View>
    </>
  )
}

const $sectionCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.md,
  marginBottom: spacing.lg,
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  fontWeight: "bold",
  color: colors.textDim,
  marginBottom: spacing.sm,
  marginLeft: spacing.xs,
  letterSpacing: 1,
})
