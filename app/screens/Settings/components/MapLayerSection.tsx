import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { MapTypeItem } from "./MapTypeItem"

interface MapLayerSectionProps {
  mapType: "satellite" | "traffic" | "terrain"
  onSetMapType: (type: "satellite" | "traffic" | "terrain") => void
}

export const MapLayerSection = ({ mapType, onSetMapType }: MapLayerSectionProps) => {
  const { themed } = useAppTheme()
  return (
    <>
      <Text text="MAP LAYER" style={themed($sectionLabel)} />
      <View style={themed($mapLayerContainer)}>
        <MapTypeItem
          label="Satellite"
          active={mapType === "satellite"}
          onPress={() => onSetMapType("satellite")}
          image="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=200&auto=format&fit=crop"
        />
        <MapTypeItem
          label="Traffic"
          active={mapType === "traffic"}
          onPress={() => onSetMapType("traffic")}
          image="https://images.unsplash.com/photo-1545147986-a9d6f210df77?q=80&w=200&auto=format&fit=crop"
        />
        <MapTypeItem
          label="Terrain"
          active={mapType === "terrain"}
          onPress={() => onSetMapType("terrain")}
          image="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=200&auto=format&fit=crop"
        />
      </View>
    </>
  )
}

const $sectionLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  fontWeight: "bold",
  color: colors.textDim,
  marginBottom: spacing.sm,
  marginLeft: spacing.xs,
  letterSpacing: 1,
})

const $mapLayerContainer: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 24,
})
