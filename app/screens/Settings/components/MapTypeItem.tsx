import { View, ViewStyle, Image, TouchableOpacity, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface MapTypeItemProps {
  label: string
  active: boolean
  onPress: () => void
  image: string
}

export const MapTypeItem = ({ label, active, onPress, image }: MapTypeItemProps) => {
  const { theme, themed } = useAppTheme()
  return (
    <TouchableOpacity style={themed($mapTypeItem)} activeOpacity={0.8} onPress={onPress}>
      <View
        style={[
          themed($mapImageContainer),
          active && { borderColor: theme.colors.palette.iosPrimary, borderWidth: 2 },
        ]}
      >
        <Image source={{ uri: image }} style={themed($mapImage)} />
        {active && (
          <View style={themed($checkmarkContainer)}>
            <View style={themed($checkmark)} />
          </View>
        )}
      </View>
      <Text
        text={label}
        style={[
          themed($mapTypeLabel),
          active && { color: theme.colors.palette.iosPrimary, fontWeight: "bold" },
        ]}
      />
    </TouchableOpacity>
  )
}

const $mapTypeItem: ThemedStyle<ViewStyle> = () => ({
  width: "30%",
  alignItems: "center",
})

const $mapImageContainer: ThemedStyle<ViewStyle> = () => ({
  width: "100%",
  aspectRatio: 1,
  borderRadius: 16,
  overflow: "hidden",
  marginBottom: 8,
  backgroundColor: "#000",
})

const $mapImage: ThemedStyle<any> = () => ({
  width: "100%",
  height: "100%",
  opacity: 0.8,
})

const $checkmarkContainer: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 6,
  right: 6,
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: "#007AFF",
  borderWidth: 1,
  borderColor: "#fff",
  alignItems: "center",
  justifyContent: "center",
})

const $checkmark: ThemedStyle<ViewStyle> = () => ({
  width: 4,
  height: 4,
  borderRadius: 2,
  backgroundColor: "#fff",
})

const $mapTypeLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})
