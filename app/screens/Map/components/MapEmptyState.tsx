import React from "react"
import { View, ViewStyle, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import SvgIcon from "@/components/SvgIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface MapEmptyStateProps {
  onAddDevice: () => void
}

const MapEmptyState = ({ onAddDevice }: MapEmptyStateProps) => {
  const {
    themed,
    theme: { spacing, colors },
  } = useAppTheme()
  const insets = useSafeAreaInsets()
  return (
    <View style={[themed($container), { bottom: insets.bottom + spacing.xxxl + spacing.md }]}>
      <View style={themed($card)}>
        <View style={themed($iconContainer)}>
          <SvgIcon icon="Devices" size={spacing.xl} fill={colors.brand.primary} />
        </View>

        <View style={themed($content)}>
          <Text
            text="Chưa có thiết bị nào"
            preset="heading-h4"
            weight="medium"
            color={colors.text}
          />
          <Text
            text="Hãy thêm thiết bị để bắt đầu theo dõi vị trí trực tuyến"
            preset="body-2"
            weight="normal"
            style={{ textAlign: "center" }}
            color={colors.textDim}
          />
        </View>

        <TouchableOpacity style={themed($button)} onPress={onAddDevice} activeOpacity={0.8}>
          <Text
            text="Thêm thiết bị ngay"
            preset="button-2"
            color={colors.white}
            weight="semiBold"
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default MapEmptyState

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  left: spacing.lg,
  right: spacing.lg,
  zIndex: 10,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.white,
  borderRadius: 20,
  padding: spacing.lg,
  alignItems: "center",
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 8,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: spacing.xxxl,
  height: spacing.xxxl,
  borderRadius: spacing.xxxl,
  backgroundColor: colors.brand.secondary,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.md,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.lg,
  gap: spacing.xs,
})

const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brand.primary,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.xl,
  borderRadius: spacing.md,
  width: "100%",
  alignItems: "center",
})
