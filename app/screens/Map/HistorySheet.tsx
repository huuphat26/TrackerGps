import { forwardRef, useCallback } from "react"
import { View, TextStyle, ViewStyle, TouchableOpacity } from "react-native"
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import SvgIcon from "@/components/SvgIcon"

interface HistorySheetProps {
  onPlayPause?: () => void
  isPlaying?: boolean
  progress?: number
  onSliderChange?: (value: number) => void
  stats?: {
    distance: string
    duration: string
    avgSpeed: string
  }
}

export const HistorySheet = forwardRef<BottomSheetModal, HistorySheetProps>(
  ({ onPlayPause, isPlaying, progress = 0, onSliderChange, stats }, ref) => {
    const { themed, theme } = useAppTheme()
    const { colors } = theme

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
      ),
      [],
    )

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["35%"]}
        enablePanDownToClose={false}
        backgroundStyle={{
          backgroundColor: colors.palette.neutral100,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={themed($container)}>
          <View style={themed($statsRow)}>
            <View style={themed($statItem)}>
              <Text text="Distance" style={themed($statLabel)} />
              <Text text={stats?.distance || "0.0 km"} preset="bold" style={themed($statValue)} />
            </View>
            <View style={themed($statItem)}>
              <Text text="Duration" style={themed($statLabel)} />
              <Text text={stats?.duration || "00:00"} preset="bold" style={themed($statValue)} />
            </View>
            <View style={themed($statItem)}>
              <Text text="Avg Speed" style={themed($statLabel)} />
              <Text text={stats?.avgSpeed || "0 km/h"} preset="bold" style={themed($statValue)} />
            </View>
          </View>

          <View style={themed($controlsRow)}>
            <TouchableOpacity style={themed($playButton)} onPress={onPlayPause}>
              <SvgIcon
                icon="Map"
                size={24}
                fill="white"
                style={{ transform: [{ rotate: isPlaying ? "90deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            <View style={themed($sliderContainer)}>
              <View style={themed($progressBarBackground)}>
                <View style={[themed($progressBarFill), { width: `${progress * 100}%` }]} />
              </View>
            </View>
          </View>

          <View style={themed($timeInfo)}>
            <Text text="08:00 AM" style={themed($timeLabel)} />
            <Text text="05:30 PM" style={themed($timeLabel)} />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    )
  },
)

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.md,
})

const $statsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: spacing.lg,
})

const $statItem: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  flex: 1,
})

const $statLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
  marginBottom: 4,
})

const $statValue: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $controlsRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
})

const $playButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.brand.primary,
  alignItems: "center",
  justifyContent: "center",
  marginRight: spacing.md,
})

const $sliderContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  justifyContent: "center",
})

const $progressBarBackground: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 4,
  backgroundColor: colors.palette.neutral300,
  borderRadius: 2,
  overflow: "hidden",
})

const $progressBarFill: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: "100%",
  backgroundColor: colors.brand.primary,
})

const $timeInfo: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: -8,
})

const $timeLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 10,
  color: colors.textDim,
})
