import { View, ViewStyle, Switch, Platform, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import SvgIcon from "@/components/SvgIcon"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

interface SettingItemProps {
  icon: any
  title: string
  subtitle: string
  value: boolean
  onToggle: (v: boolean) => void
  isFirst?: boolean
  iconBg: string
  iconColor: string
}

export const SettingItem = ({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  isFirst,
  iconBg,
  iconColor,
}: SettingItemProps) => {
  const { theme, themed } = useAppTheme()
  return (
    <View style={[themed($settingRow), !isFirst && themed($rowBorder)]}>
      <View style={[themed($iconCircle), { backgroundColor: iconBg }]}>
        <SvgIcon icon={icon} size={20} fill={iconColor} />
      </View>
      <View style={themed($settingTextContainer)}>
        <Text text={title} preset="bold" style={themed($settingTitle)} />
        <Text text={subtitle} style={themed($settingSubtitle)} />
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.colors.palette.neutral300, true: "#34C759" }}
        thumbColor={Platform.OS === "ios" ? undefined : theme.colors.palette.neutral100}
      />
    </View>
  )
}

const $settingRow: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 12,
})

const $rowBorder: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderTopWidth: 1,
  borderTopColor: colors.separator,
})

const $iconCircle: ThemedStyle<ViewStyle> = () => ({
  width: 36,
  height: 36,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
})

const $settingTextContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $settingTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 16,
})

const $settingSubtitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})
