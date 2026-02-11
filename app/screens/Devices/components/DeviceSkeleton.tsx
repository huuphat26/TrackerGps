import React from "react"
import { View, ViewStyle } from "react-native"
import { Skeleton } from "moti/skeleton"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export const DeviceSkeleton = () => {
  const {
    themed,
    theme: { isDark, spacing },
  } = useAppTheme()
  const colorMode = isDark ? "dark" : "light"

  return (
    <View style={themed($card)}>
      <View style={themed($leftContainer)}>
        <Skeleton
          colorMode={colorMode}
          radius={spacing.sm}
          height={spacing.xxl}
          width={spacing.xxl}
        />

        <View style={themed($infoContainer)}>
          <View style={{ marginBottom: spacing.xxs }}>
            <Skeleton colorMode={colorMode} width={120} height={20} />
          </View>

          <View style={{ marginBottom: spacing.xs }}>
            <Skeleton colorMode={colorMode} width={80} height={16} />
          </View>

          <View style={themed($statusRow)}>
            <Skeleton colorMode={colorMode} width={100} height={14} />
          </View>
        </View>
      </View>

      <View style={themed($actionContainer)}>
        <View style={{ marginBottom: 8 }}>
          <Skeleton colorMode={colorMode} width={80} height={28} radius={12} />
        </View>

        <Skeleton colorMode={colorMode} width={70} height={14} />
      </View>
    </View>
  )
}

export const DeviceListSkeleton = () => {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <DeviceSkeleton key={i} />
      ))}
    </View>
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

const $infoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  justifyContent: "center",
  marginLeft: spacing.sm,
})

const $statusRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $actionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  marginLeft: spacing.xs,
})
