import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useMemo } from "react"
import { View, ViewStyle, FlatList, TextStyle, TouchableOpacity } from "react-native"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import { Device, DeviceCard } from "@/components/DeviceCard"
import SvgIcon from "@/components/SvgIcon"

const MOCK_DEVICES: Device[] = [
  {
    id: "1",
    name: "Toyota Camry",
    licensePlate: "51F-123.45",
    status: "online",
    battery: 85,
    signal: 4,
    type: "car",
  },
  {
    id: "2",
    name: "Tesla Model 3",
    licensePlate: "72A-555.88",
    status: "online",
    battery: 12,
    signal: 3,
    type: "car",
  },
  {
    id: "3",
    name: "Honda SH",
    licensePlate: "29B-888.22",
    status: "offline",
    battery: 90,
    signal: 0,
    type: "bike",
  },
]

import { useNavigation } from "@react-navigation/native"

interface DevicesScreenProps {}

const DevicesScreen: FC<DevicesScreenProps> = () => {
  const navigation = useNavigation<any>()
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const handleWakeUp = (id: string) => {
    console.log("Wake up device:", id)
  }

  const handleViewMap = (device: Device) => {
    navigation.navigate("Map", {
      screen: "MapScreen",
      params: { mode: "live", deviceId: device.id },
    })
  }

  const handlePressDevice = (device: Device) => {
    navigation.navigate("History", { screen: "HistoryScreen", params: { deviceId: device.id } })
  }

  const renderItem = ({ item }: { item: Device }) => (
    <DeviceCard
      device={item}
      onWakeUp={handleWakeUp}
      onViewMap={handleViewMap}
      onPress={handlePressDevice}
    />
  )

  const ListFooter = useMemo(() => {
    return (
      <View style={themed($footerContainer)}>
        <TouchableOpacity
          style={themed($overviewCard)}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("Map", { screen: "MapScreen", params: { mode: "live" } })
          }
        >
          <View style={themed($overviewContent)}>
            <View>
              <Text text="FLEET OVERVIEW" style={themed($overviewLabel)} />
              <Text text="Show all on Map" style={themed($overviewTitle)} />
            </View>
            <View style={themed($mapIconCircle)}>
              <SvgIcon icon="Map" size={24} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }, [themed, colors])

  return (
    <View style={themed($container)}>
      <Header title="My Devices" style={themed($header)} />

      <FlatList
        data={MOCK_DEVICES}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={themed($listContent)}
        ListFooterComponent={ListFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $header: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
  paddingBottom: spacing.xl,
})

const $footerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $overviewCard: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  backgroundColor: "#8D6E63",
  borderRadius: 16,
  height: 120,
  justifyContent: "flex-end",
  padding: spacing.md,
  overflow: "hidden",
})

const $overviewContent: ThemedStyle<ViewStyle> = () => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-end",
})

const $overviewLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 10,
  color: "rgba(255, 255, 255, 0.8)",
  fontWeight: "700",
  letterSpacing: 1,
  marginBottom: 4,
})

const $overviewTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 20,
  color: colors.white,
  fontWeight: "bold",
})

const $mapIconCircle: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  alignItems: "center",
  justifyContent: "center",
})

export default DevicesScreen
