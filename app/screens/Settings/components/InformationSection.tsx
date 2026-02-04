import { View, ViewStyle, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { InfoItem } from "./InfoItem"

export const InformationSection = () => {
  const { themed } = useAppTheme()
  return (
    <>
      <Text text="Information" style={themed($sectionLabel)} />
      <View style={themed($sectionCard)}>
        <InfoItem label="App Version" value="v1.0.0" isFirst />
        <InfoItem label="Developer" value="Huu Phat" />
        <InfoItem label="Privacy Policy" hasChevron />
      </View>
    </>
  )
}

const $sectionCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.md,
  marginBottom: spacing.lg,
})

const $sectionLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  fontSize: 12,
  fontWeight: "bold",
  color: colors.textDim,
  marginBottom: spacing.sm,
  marginLeft: spacing.xs,
  letterSpacing: 1,
})
