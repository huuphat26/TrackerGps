import { FC, useCallback, useState } from "react"
import { View, ViewStyle, FlatList, TouchableOpacity, RefreshControl } from "react-native"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { Text } from "@/components/Text"
import { Header } from "@/components/Header"
import SvgIcon from "@/components/SvgIcon"
import { DeviceCard } from "./components/DeviceCard"
import { Device } from "@/services/api/DeviceServices/DeviceType"
import { useDevices } from "@/services/queries/Device/useDeviceQueries"
import { DeviceListSkeleton } from "./components/DeviceSkeleton"
import { NavigationService } from "@/navigators/navigationUtilities"

interface DevicesScreenProps {}

const DevicesScreen: FC<DevicesScreenProps> = () => {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()

  const [refreshing, setRefreshing] = useState(false)
  const { data: response, isLoading, refetch } = useDevices({ page: 1, pageSize: 10 })
  const devices = response?.data || []

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const handleWakeUp = (id: string) => {
    console.log("Wake up device:", id)
  }

  const handleViewMap = (device: Device) => {
    NavigationService.navigate("Map", {
      screen: "LiveMapScreen",
      params: { deviceId: device.id },
    })
  }

  const handlePressDevice = (device: Device) => {
    NavigationService.navigate("History", {
      screen: "HistoryScreen",
      params: { deviceId: device.id },
    })
  }

  const handleAddDevice = () => {
    NavigationService.navigate("Devices", { screen: "AddDeviceScreen" })
  }

  const renderItem = useCallback(
    ({ item }: { item: Device }) => (
      <DeviceCard
        device={item}
        onWakeUp={handleWakeUp}
        onViewMap={handleViewMap}
        onPress={handlePressDevice}
      />
    ),
    [],
  )

  const EmptyState = () => (
    <View style={themed($emptyContainer)}>
      <SvgIcon icon="Devices" size={120} fill={colors.palette.neutral400} />
      <Text text="Chưa có thiết bị" preset="lg" weight="medium" color={colors.text} />
      <Text
        text="Bắt đầu bằng cách thêm thiết bị đầu tiên của bạn"
        color={colors.textDim}
        weight="medium"
        preset="body-3"
        style={{ textAlign: "center" }}
      />
      <TouchableOpacity activeOpacity={0.8} style={themed($emptyButton)} onPress={handleAddDevice}>
        <Text text="Thêm thiết bị" preset="button-1" weight="semiBold" color={colors.white} />
      </TouchableOpacity>
    </View>
  )

  const LoadingState = () => (
    <View style={themed($listContent)}>
      <DeviceListSkeleton />
    </View>
  )

  return (
    <View style={themed($container)}>
      <Header title="Thiết bị của tôi" style={themed($header)} />

      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id + index.toString()}
        contentContainerStyle={themed($listContent)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={isLoading ? <LoadingState /> : <EmptyState />}
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
  paddingBottom: spacing.xl,
})

const $emptyContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.xs,
  marginTop: spacing.xxxl,
})

const $emptyButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.brand.primary,
  paddingHorizontal: spacing.xl,
  paddingVertical: spacing.md,
  borderRadius: spacing.lg,
  minWidth: 160,
  alignItems: "center",
  marginTop: spacing.md,
})

export default DevicesScreen
