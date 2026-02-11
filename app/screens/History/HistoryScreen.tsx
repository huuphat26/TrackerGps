import { FC, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, TouchableOpacity } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import SvgIcon from "@/components/SvgIcon"
import { HistoryLogEntry, StatusType } from "@/services/maps/useHistoryData"
import { useDeviceDetails, useDeviceHistory } from "@/services/queries/Device/useDeviceQueries"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { HistoryStackParamList } from "./HistoryStack"

type HistoryScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HistoryStackParamList, "HistoryScreen">,
  NativeStackScreenProps<AppStackParamList>
>

export const HistoryScreen: FC<HistoryScreenProps> = ({ navigation, route }) => {
  const { theme, themed } = useAppTheme()
  const { deviceId } = route.params || { deviceId: "" }
  const [currentDate] = useState(new Date())

  const { data: device } = useDeviceDetails(deviceId || "")

  const { data: historyData } = useDeviceHistory(deviceId || "", {
    page: 1,
    pageSize: 20,
    from: currentDate.toISOString(),
  })

  const logs: HistoryLogEntry[] = (historyData || []).map((item, index) => ({
    id: index.toString(),
    time: new Date(item.createdAt).toLocaleTimeString(),
    location: `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`,
    eventTitle: "Position Update",
    statusType: "moving",
    coordinate: { latitude: item.latitude, longitude: item.longitude },
  }))

  const renderStatusBadge = (type: StatusType) => {
    const config: Record<string, { text: string; color: string; bg: string }> = {
      moving: { text: "Moving", color: "#007AFF", bg: "#E5F1FF" },
      stop: { text: "Stop", color: "#FF3B30", bg: "#FFEBEB" },
      engine_on: { text: "Engine On", color: "#34C759", bg: "#EBF9EE" },
      parked: { text: "Parked", color: "#FF9500", bg: "#FFF5E5" },
      offline: { text: "Offline", color: "#8E8E93", bg: "#F2F2F7" },
    }
    const { text, color, bg } = config[type] || config.moving
    return (
      <View style={[themed($badge), { backgroundColor: bg }]}>
        <View style={[themed($badgeDot), { backgroundColor: color }]} />
        <Text text={text} style={[themed($badgeText), { color }]} />
      </View>
    )
  }

  const renderLogItem = ({ item }: { item: HistoryLogEntry }) => (
    <View style={themed($row)}>
      <View style={themed($timeCol)}>
        <Text text={item?.time} style={themed($timeText)} />
      </View>

      <View style={themed($locationCol)}>
        <Text text={item?.eventTitle} preset="bold" style={themed($eventTitle)} />
        <Text text={item?.location} style={themed($addressText)} />
      </View>

      <View style={themed($statusCol)}>{renderStatusBadge(item.statusType)}</View>
    </View>
  )
  const insets = useSafeAreaInsets()
  return (
    <View style={[themed($container), { paddingBottom: insets.bottom + 64 }]}>
      <Header
        title="History"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="bell"
        onRightPress={() => {}}
      />

      <View style={themed($content)}>
        <View style={themed($dateNavigator)}>
          <TouchableOpacity>
            <SvgIcon icon="TimeLine" size={20} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
          <Text text={currentDate.toDateString()} preset="bold" />
        </View>

        {device && (
          <View style={themed($deviceCard)}>
            <View style={themed($avatarContainer)}>
              <SvgIcon icon="Car" size={32} fill={theme.colors.brand.primary} />
            </View>
            <View style={themed($deviceInfo)}>
              <Text text={device.name} preset="bold" style={{ fontSize: 18 }} />
              <Text
                text={device.licensePlate || device.deviceId}
                style={{ color: theme.colors.textDim }}
              />
            </View>
            <View
              style={[
                themed($activeBadge),
                { backgroundColor: device.status === "online" ? "#EBF9EE" : "#F2F2F7" },
              ]}
            >
              <Text
                text={device.status === "online" ? "Online" : "Offline"}
                style={{
                  color: device.status === "online" ? "#34C759" : "#8E8E93",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              />
            </View>
          </View>
        )}

        <View style={themed($tableHeader)}>
          <Text text="TIME" style={themed($headerLabel)} />
          <Text text="LOCATION" style={[themed($headerLabel), { flex: 2 }]} />
          <Text text="STATUS" style={[themed($headerLabel), { textAlign: "right" }]} />
        </View>

        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item, index) => item?.id + index.toString()}
          showsVerticalScrollIndicator={false}
        />
        <View style={themed($footer)}>
          <TouchableOpacity
            style={themed($viewButton)}
            onPress={() =>
              navigation.navigate("HistoryMapScreen", {
                deviceId: deviceId,
              })
            }
          >
            <SvgIcon icon="Map" fill="white" size={20} />
            <Text text="View Route on Map" style={themed($viewButtonText)} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral200,
})

const $content: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  padding: spacing.md,
})

const $dateNavigator: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xl,
  backgroundColor: colors.palette.neutral100,
  padding: spacing.sm,
  borderRadius: 20,
  marginBottom: spacing.md,
})

const $deviceCard: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  padding: spacing.md,
  borderRadius: 20,
  marginBottom: spacing.lg,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 50,
  height: 50,
  borderRadius: 25,
  overflow: "hidden",
  backgroundColor: colors.palette.neutral300,
  marginRight: 12,
})

const $deviceInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $activeBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.xxxs,
  borderRadius: spacing.sm,
})

const $tableHeader: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  paddingHorizontal: spacing.sm,
  marginBottom: spacing.sm,
})

const $headerLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 10,
  color: colors.textDim,
  fontWeight: "bold",
  letterSpacing: 1,
  flex: 1,
})

const $row: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexDirection: "row",
  paddingVertical: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.separator,
})

const $timeCol: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $timeText: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  fontWeight: "bold",
})

const $locationCol: ThemedStyle<ViewStyle> = () => ({
  flex: 2,
  paddingRight: 8,
})

const $eventTitle: ThemedStyle<TextStyle> = () => ({
  fontSize: 14,
  marginBottom: 2,
})

const $addressText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 12,
  color: colors.textDim,
})

const $statusCol: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  alignItems: "flex-end",
})

const $badge: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
})

const $badgeDot: ThemedStyle<ViewStyle> = () => ({
  width: 6,
  height: 6,
  borderRadius: 3,
  marginRight: 4,
})

const $badgeText: ThemedStyle<TextStyle> = () => ({
  fontSize: 10,
  fontWeight: "bold",
})

const $footer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
})

const $viewButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brand.primary,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.md,
  borderRadius: 25,
  shadowColor: colors.brand.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 5,
})

const $viewButtonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.white,
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
})

export default HistoryScreen
