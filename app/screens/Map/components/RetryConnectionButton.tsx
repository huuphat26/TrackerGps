import { FC } from "react"
import { View, ViewStyle, TextStyle, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { MotiView } from "moti"
import SvgIcon from "@/components/SvgIcon"

export interface RetryConnectionButtonProps {
  visible: boolean
  onRetry: () => void
}

/**
 * Retry connection button shown in center of screen when connection fails
 * Only visible when `visible` prop is true
 */
export const RetryConnectionButton: FC<RetryConnectionButtonProps> = ({ visible, onRetry }) => {
  const { themed, theme } = useAppTheme()

  if (!visible) return null

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "timing", duration: 300 }}
      style={themed($overlay)}
    >
      <View style={themed($container)}>
        <View style={themed($iconContainer)}>
          <Text text="⚠️" style={themed($warningIcon)} />
        </View>

        <Text text="Connection Lost" preset="bold" style={themed($title)} />
        <Text
          text="Unable to connect to GPS tracker. Please check your internet connection."
          style={themed($message)}
        />

        <TouchableOpacity style={themed($button)} onPress={onRetry} activeOpacity={0.8}>
          <SvgIcon icon="Map" size={18} fill={theme.colors.white} />
          <Text text="Retry Connection" style={themed($buttonText)} />
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}

const $overlay: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 100,
})

const $container: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.lg,
  marginHorizontal: spacing.xl,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 5,
  maxWidth: 320,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: `${colors.palette.angry500}20`,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.sm,
})

const $warningIcon: ThemedStyle<TextStyle> = () => ({
  fontSize: 32,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  fontSize: 18,
  marginBottom: spacing.xs,
})

const $message: ThemedStyle<TextStyle> = ({ spacing, colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.lg,
  lineHeight: 20,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  backgroundColor: colors.brand.primary,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: 25,
  gap: spacing.xs,
  minWidth: 180,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.white,
  fontSize: 15,
  fontWeight: "bold",
})
