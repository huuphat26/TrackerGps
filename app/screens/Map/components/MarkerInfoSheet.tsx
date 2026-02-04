import { forwardRef, useCallback } from "react"
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/theme/context"
import SvgIcon from "@/components/SvgIcon"
import { ThemedStyle } from "@/theme/types"

export interface MarkerInfo {
  id: string
  name: string
  vehicle: {
    make: string
    model: string
    color: string
  }
  licensePlate: string
  status: "Active" | "Inactive"
}

interface MarkerInfoSheetProps {
  markerInfo?: MarkerInfo | null
  onRequestImage?: () => void
  onCall?: () => void
  onViewHistory?: () => void
}

export const MarkerInfoSheet = forwardRef<BottomSheetModal, MarkerInfoSheetProps>(
  ({ markerInfo, onRequestImage, onCall, onViewHistory }, ref) => {
    const { themed, theme } = useAppTheme()
    const { colors } = theme

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={"close"}
          opacity={0.8}
        />
      ),
      [],
    )

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["40%", "50%"]}
        enablePanDownToClose
        enableDismissOnClose={true}
        onChange={(index) => console.log("BottomSheetModal onChange index:", index)}
        backgroundStyle={{
          backgroundColor: colors.palette.darkSurface,
          borderRadius: theme.spacing.md,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.palette.neutral400,
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={themed($container)}>
          {markerInfo ? (
            <>
              <View style={themed($header)}>
                <Text style={themed($name)}>{markerInfo.name}</Text>
                <View
                  style={[
                    themed($statusBadge),
                    {
                      backgroundColor:
                        markerInfo.status === "Active"
                          ? "rgba(52, 199, 89, 0.2)"
                          : "rgba(142, 142, 147, 0.2)",
                    },
                  ]}
                >
                  <View
                    style={[
                      themed($statusDot),
                      {
                        backgroundColor:
                          markerInfo.status === "Active"
                            ? colors.primary
                            : colors.palette.neutral400,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      themed($statusText),
                      {
                        color:
                          markerInfo.status === "Active"
                            ? colors.palette.iosSuccess
                            : colors.palette.neutral400,
                      },
                    ]}
                  >
                    {markerInfo.status}
                  </Text>
                </View>
              </View>

              <View style={themed($vehicleInfo)}>
                <Text style={themed($vehicleText)}>
                  {markerInfo.vehicle.make} {markerInfo.vehicle.model} • {markerInfo.vehicle.color}
                </Text>
              </View>

              <View style={themed($plateContainer)}>
                <View style={themed($plate)}>
                  <Text style={themed($plateState)}>CALIFORNIA</Text>
                  <Text style={themed($plateNumber)}>{markerInfo.licensePlate}</Text>
                </View>
              </View>

              <View style={themed($actions)}>
                <TouchableOpacity style={themed($primaryButton)} onPress={onRequestImage}>
                  <SvgIcon icon="Camera" size={theme.spacing.md} fill={colors.white} />
                  <Text style={themed($buttonText)}>Request Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    themed($secondaryButton),
                    { backgroundColor: "rgba(0, 122, 255, 0.2)", borderColor: colors.primary },
                  ]}
                  onPress={onViewHistory}
                >
                  <SvgIcon icon="History" size={theme.spacing.md} fill={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={themed($secondaryButton)} onPress={onCall}>
                  <SvgIcon
                    icon="Gallery"
                    size={theme.spacing.md}
                    fill={colors.palette.iosSuccess}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={themed($emptyContainer)}>
              <Text style={{ color: colors.palette.darkTextSecondary }}>
                No marker information selected
              </Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xs,
  paddingBottom: spacing.xl,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xs,
})

const $name: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  fontWeight: "600",
  color: colors.palette.darkTextPrimary,
})

const $statusBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderRadius: spacing.xs,
})

const $statusDot: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  marginRight: spacing.xxs,
})

const $statusText: ThemedStyle<TextStyle> = () => ({
  fontSize: 12,
  fontWeight: "500",
})

const $vehicleInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $vehicleText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.palette.darkTextSecondary,
})

const $plateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $plate: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.sm,
  borderRadius: spacing.xs,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  justifyContent: "center",
  alignItems: "center",
})

const $plateState: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  fontWeight: "600",
  marginBottom: 2,
  color: colors.palette.neutral400,
})

const $plateNumber: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  fontWeight: "700",
  letterSpacing: 2,
  color: colors.palette.darkTextPrimary,
})

const $actions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
})

const $primaryButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.sm,
  borderRadius: spacing.sm,
  gap: spacing.xs,
  backgroundColor: colors.primary,
})

const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  width: 48,
  height: 48,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: spacing.sm,
  borderWidth: 1,
  backgroundColor: "rgba(52, 199, 89, 0.2)",
  borderColor: colors.palette.iosSuccess,
})

const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  fontWeight: "600",
  color: colors.white,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.xl,
  alignItems: "center",
  justifyContent: "center",
})
