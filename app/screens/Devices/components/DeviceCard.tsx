import React from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import SvgIcon from "@/components/SvgIcon"
import { Text } from "@/components/Text"

import { Device } from "@/services/api/DeviceServices/DeviceType"

interface DeviceCardProps {
  device: Device
  onWakeUp: (deviceId: string) => void
  onViewMap: (device: Device) => void
  onPress: (device: Device) => void
}

export const DeviceCard = ({ device, onWakeUp, onViewMap, onPress }: DeviceCardProps) => {
  const { themed, theme } = useAppTheme()
  const isOnline = device.status === "online"

  // Note: Using 'Car' as fallback, if 'Bike' icon exists later we can update.
  // Based on assets list, only 'Car', 'Devices', 'Gallery', 'History', 'Map', 'Setting' exist in Svg.
  // We might want to use 'Devices' for generic or strictly adhere to what's available.
  // The user prompt mentioned "Honda SH", so ideally we need a bike icon.
  // For now I'll use 'Car' and 'Devices' or just 'Car' for both if 'Bike' isn't available in IconTypes.
  // Let's assume 'Car' for now as the user has 'Car.tsx'. I will stick to 'Car' icon for consistency or check if I can use 'Devices' for others.

  // Actually, let's verify if "Bike" or similar exists? list_dir said: Camera, Car, Devices, Gallery, History, Map, Setting.
  // So 'Car' is the safe bet for vehicles.

  return (
    <TouchableOpacity style={themed($card)} activeOpacity={0.9} onPress={() => onPress(device)}>
      <View style={themed($leftContainer)}>
        <View style={themed($iconContainer)}>
          <SvgIcon icon="Car" size={24} fill={theme.colors.brand.primary} />
        </View>

        <View style={themed($infoContainer)}>
          <Text text={device.name} preset="bold" style={themed($deviceName)} />
          <Text text={device.licensePlate} style={{ color: theme.colors.textDim, fontSize: 13 }} />

          <View style={themed($statusRow)}>
            <View
              style={[
                themed($statusDot),
                {
                  backgroundColor: isOnline
                    ? theme.colors.brand.success
                    : theme.colors.brand.danger,
                },
              ]}
            />
            <Text
              text={isOnline ? "Online" : "Offline"}
              style={[
                themed($statusText),
                { color: isOnline ? theme.colors.brand.success : theme.colors.brand.danger },
              ]}
            />
            {isOnline && (
              <>
                <Text text={` • 🔋 ${device.battery}%`} style={themed($metaText)} />
                <Text text={` • 📶 `} style={themed($metaText)} />
              </>
            )}
            {!isOnline && <Text text={` • Xem gần đây`} style={themed($metaText)} />}
          </View>
        </View>
      </View>

      <View style={themed($actionContainer)}>
        <TouchableOpacity
          style={[themed($wakeUpButton), !isOnline && themed($wakeUpButtonDisabled)]}
          onPress={() => onWakeUp(device.id)}
          disabled={!isOnline}
        >
          <Text
            text="Đánh thức"
            style={[themed($wakeUpText), !isOnline && themed($wakeUpTextDisabled)]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onViewMap(device)} activeOpacity={0.7}>
          <Text text="Xem bản đồ" style={themed($viewMapText)} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.white,
  borderRadius: 16,
  padding: spacing.md,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: spacing.sm,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
})

const $leftContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: colors.brand.secondary,
  alignItems: "center",
  justifyContent: "center",
  marginRight: spacing.sm,
})

const $infoContainer: ThemedStyle<ViewStyle> = () => ({
  justifyContent: "center",
})

const $deviceName: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.text,
  marginBottom: 2,
})

const $statusRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
})

const $statusDot: ThemedStyle<ViewStyle> = () => ({
  width: 6,
  height: 6,
  borderRadius: 3,
  marginRight: 4,
})

const $statusText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
})

const $metaText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginLeft: 2,
})

const $actionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  marginLeft: spacing.xs,
})

const $wakeUpButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brand.primary,
  paddingHorizontal: spacing.sm,
  paddingVertical: 6,
  borderRadius: 12,
  minWidth: 80,
  alignItems: "center",
  marginBottom: 6,
})

const $wakeUpButtonDisabled: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral300,
})

const $wakeUpText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.white,
  fontSize: 12,
  fontWeight: "600",
})

const $wakeUpTextDisabled: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral500,
})

const $viewMapText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.brand.primary,
  fontSize: 12,
  fontWeight: "bold",
  letterSpacing: 0.5,
})
