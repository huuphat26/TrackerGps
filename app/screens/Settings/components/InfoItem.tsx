import { View, ViewStyle, TouchableOpacity, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import SvgIcon from "@/components/SvgIcon"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface InfoItemProps {
  label: string
  value?: string
  hasChevron?: boolean
  isFirst?: boolean
}

export const InfoItem = ({ label, value, hasChevron, isFirst }: InfoItemProps) => {
  const { theme, themed } = useAppTheme()
  return (
    <TouchableOpacity
      style={[themed($infoRow), !isFirst && themed($rowBorder)]}
      activeOpacity={0.7}
    >
      <Text text={label} preset="bold" style={themed($infoLabel)} />
      <View style={themed($infoRight)}>
        {!!value && <Text text={value} style={themed($infoValue)} />}
        {hasChevron && <SvgIcon icon="Map" size={16} fill={theme.colors.palette.neutral400} />}
      </View>
    </TouchableOpacity>
  )
}

const $infoRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 16,
})

const $rowBorder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})

const $infoLabel: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $infoRight: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
})

const $infoValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginRight: 8,
})
