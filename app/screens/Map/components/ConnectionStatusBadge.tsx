import { FC } from "react"
import { ViewStyle, TextStyle, View } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { MqttConnectionStatus } from "@/hooks/useMqttConnection"

interface ConnectionStatusBadgeProps {
  status: MqttConnectionStatus
  retryCount?: number
}

/**
 * Compact badge showing MQTT connection status
 * Positioned at top-right corner of screen
 */
const ConnectionStatusBadge: FC<ConnectionStatusBadgeProps> = ({ status, retryCount }) => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          text: "Connected",
          color: colors.text,
          backgroundColor: `${colors.brand.primary}20`,
          icon: "🟢",
        }
      case "connecting":
        return {
          text: "Connecting...",
          color: colors.text,
          backgroundColor: `${colors.palette.secondary500}20`,
          icon: "🟡",
        }
      case "disconnected":
        return {
          text: "Disconnected",
          color: colors.text,
          backgroundColor: `${colors.palette.neutral500}20`,
          icon: "⚪",
        }
      case "error":
        return {
          text: retryCount ? `Connection Failed (${retryCount}/3)` : "Connection Failed",
          color: colors.palette.angry500,
          backgroundColor: `${colors.palette.angry500}20`,
          icon: "🔴",
        }
      case "idle":
        return {
          text: "Idle",
          color: colors.textDim,
          backgroundColor: colors.palette.neutral200,
          icon: "⚪",
        }
      default:
        return {
          text: "Unknown",
          color: colors.textDim,
          backgroundColor: colors.palette.neutral200,
          icon: "⚫",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <View style={[themed($container), { backgroundColor: config.backgroundColor }]}>
      <Text text={config.icon} preset="body-3" weight="semiBold" />
      <Text text={config.text} preset="body-3" weight="semiBold" color={config.color} />
    </View>
  )
}

export default ConnectionStatusBadge

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  top: spacing.xxxl,
  right: spacing.md,
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  zIndex: 10,
  gap: spacing.xxs,
})

const $icon: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  marginRight: 6,
})

const $text: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "600",
})
