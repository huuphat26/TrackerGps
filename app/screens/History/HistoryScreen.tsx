import { FC, useEffect, useState } from "react"
import { View, ViewStyle, TextStyle, FlatList, TouchableOpacity, Image } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import SvgIcon from "@/components/SvgIcon"
import { useHistoryData, HistoryLogEntry, StatusType } from "@/services/maps/useHistoryData"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { HistoryStackParamList } from "./HistoryStack"

type HistoryScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HistoryStackParamList, "HistoryScreen">,
  NativeStackScreenProps<AppStackParamList>
>

export const HistoryScreen: FC<HistoryScreenProps> = ({ navigation }) => {
  const { theme, themed } = useAppTheme()
  const { fetchHistory, currentDate, loading } = useHistoryData()
  const [logs, setLogs] = useState<HistoryLogEntry[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchHistory(currentDate, "1")
      setLogs(data)
    }
    load()
  }, [currentDate])

  const renderStatusBadge = (type: StatusType) => {
    const config = {
      moving: { text: "Moving", color: "#007AFF", bg: "#E5F1FF" },
      stop: { text: "Stop", color: "#FF3B30", bg: "#FFEBEB" },
      engine_on: { text: "Engine On", color: "#34C759", bg: "#EBF9EE" },
      parked: { text: "Parked", color: "#FF9500", bg: "#FFF5E5" },
      offline: { text: "Offline", color: "#8E8E93", bg: "#F2F2F7" },
    }
    const { text, color, bg } = config[type]
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
        <Text text={item.time.split(" ")[0]} style={themed($timeText)} />
        <Text text={item.time.split(" ")[1]} style={themed($timePeriod)} />
      </View>

      <View style={themed($locationCol)}>
        <Text
          text={
            item.eventTitle === "Moving" ||
            item.eventTitle === "Short Stop" ||
            item.eventTitle === "Parked(Overnight)"
              ? item.location
              : item.eventTitle
          }
          preset="bold"
          style={themed($eventTitle)}
        />
        <Text text={item.subInfo || item.location} style={themed($addressText)} />
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
        rightIcon="bell" // Placeholder for calendar icon if not available
        onRightPress={() => {}}
      />

      <View style={themed($content)}>
        <View style={themed($dateNavigator)}>
          <TouchableOpacity>
            <SvgIcon icon="Map" size={20} style={{ transform: [{ rotate: "180deg" }] }} />
          </TouchableOpacity>
          <Text text="Feb 03, 2024" preset="bold" />
          <TouchableOpacity>
            <SvgIcon icon="Map" size={20} />
          </TouchableOpacity>
        </View>

        <View style={themed($deviceCard)}>
          <View style={themed($avatarContainer)}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=100&auto=format&fit=crop",
              }}
              style={themed($avatar)}
            />
          </View>
          <View style={themed($deviceInfo)}>
            <Text text="Toyota Camry" preset="bold" style={{ fontSize: 18 }} />
            <Text text="51F-123.45" style={{ color: theme.colors.textDim }} />
          </View>
          <View style={[themed($activeBadge), { backgroundColor: "#EBF9EE" }]}>
            <Text text="Active" style={{ color: "#34C759", fontSize: 12, fontWeight: "600" }} />
          </View>
        </View>

        <View style={themed($tableHeader)}>
          <Text text="TIME" style={themed($headerLabel)} />
          <Text text="LOCATION" style={[themed($headerLabel), { flex: 2 }]} />
          <Text text="STATUS" style={[themed($headerLabel), { textAlign: "right" }]} />
        </View>

        <FlatList
          data={logs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          // contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={themed($footer)}>
              <TouchableOpacity
                style={themed($viewButton)}
                onPress={() =>
                  navigation.navigate("Map", {
                    screen: "MapScreen",
                    params: { mode: "history" },
                  })
                }
              >
                <SvgIcon icon="Map" fill="white" size={20} />
                <Text text="View Route on Map" style={themed($viewButtonText)} />
              </TouchableOpacity>
            </View>
          }
        />
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
  justifyContent: "space-between",
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

const $avatar: ThemedStyle<any> = () => ({
  width: "100%",
  height: "100%",
})

const $deviceInfo: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $activeBadge: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 10,
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

const $timePeriod: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 10,
  color: colors.textDim,
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
  // position: "absolute",
  // bottom: spacing.lg,
  // left: spacing.md,
  // right: spacing.md,
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
