import { forwardRef, useCallback, useEffect } from "react"
import {
  View,
  Text,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
} from "react-native"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface ImageViewerSheetProps {
  imageUri?: string | null
  isLoading?: boolean
}

export const ImageViewerSheet = forwardRef<BottomSheetModal, ImageViewerSheetProps>(
  ({ imageUri, isLoading }, ref) => {
    const { themed, theme } = useAppTheme()
    const { colors } = theme

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={"close"}
          opacity={0.9}
        />
      ),
      [],
    )

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["90%"]}
        enablePanDownToClose
        enableDismissOnClose={true}
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
          <View style={themed($header)}>
            <Text style={themed($title)}>Camera Feed</Text>
          </View>

          <View style={themed($imageContainer)}>
            {isLoading ? (
              <View style={themed($loadingContainer)}>
                <View style={themed($pulsingCircle)}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <Text style={themed($loadingTitle)}>Requesting Image</Text>
                <Text style={themed($loadingDescription)}>
                  Waiting for camera to capture and transmit...
                </Text>
              </View>
            ) : imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={themed($image)}
                resizeMode="contain"
                onError={(error) => {
                  console.error("[ImageViewerSheet] Image load error:", error.nativeEvent.error)
                }}
                onLoad={() => {
                  console.log("[ImageViewerSheet] Image loaded successfully")
                }}
              />
            ) : (
              <View style={themed($emptyContainer)}>
                <Text style={themed($emptyText)}>No image available</Text>
              </View>
            )}
          </View>

          {imageUri && !isLoading && (
            <View style={themed($footer)}>
              <Text style={themed($footerText)}>Swipe down to close</Text>
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
  paddingTop: spacing.sm,
  paddingBottom: spacing.xl,
})

const $header: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 24,
  fontWeight: "700",
  color: colors.palette.darkTextPrimary,
})

const $imageContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  height: 500,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.md,
})

const $image: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: "100%",
  height: 500,
  borderRadius: spacing.sm,
})

const $loadingContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.lg,
})

const $pulsingCircle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: "rgba(52, 199, 89, 0.1)",
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#34C759",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
})

const $loadingTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 18,
  fontWeight: "600",
  color: colors.palette.darkTextPrimary,
})

const $loadingDescription: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.palette.darkTextSecondary,
  textAlign: "center",
  paddingHorizontal: 40,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 16,
  color: colors.palette.darkTextSecondary,
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingTop: spacing.md,
  alignItems: "center",
})

const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 13,
  color: colors.palette.neutral400,
})
