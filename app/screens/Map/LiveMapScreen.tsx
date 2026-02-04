import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import SvgIcon from "@/components/SvgIcon"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { MapStackParamList } from "./MapStack"
import { Marker } from "react-native-maps"
import { cameraCommandService } from "@/services/mqtt/CameraCommandService"
import { useMap } from "@/services/maps"
import { MapMarker } from "@/services/maps/MapService"
import { useMqttConnection } from "@/hooks"
import { cameraUploadService } from "@/services/mqtt/CameraUploadService"
import { gpsFeedService } from "@/services/mqtt/GpsFeedService"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { ImageViewerSheet } from "./components/ImageViewerSheet"
import { MarkerInfo, MarkerInfoSheet } from "./components/MarkerInfoSheet"
import { RetryConnectionButton } from "./components/RetryConnectionButton"
import { SharedMapView } from "@/components/Map"
import ConnectionStatusBadge from "./components/ConnectionStatusBadge"

type Props = CompositeScreenProps<
  NativeStackScreenProps<MapStackParamList, "LiveMapScreen">,
  NativeStackScreenProps<AppStackParamList>
>

const LiveMapScreen: FC<Props> = ({ navigation, route }) => {
  const { deviceId } = route.params || {}

  const { themed } = useAppTheme()
  const { mapRef, region, markers, addMarker, animateToCoordinate } = useMap()

  const bottomSheetRef = useRef<BottomSheetModal | null>(null)
  const imageViewerRef = useRef<BottomSheetModal | null>(null)

  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<MarkerInfo | null>(null)
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  // MQTT connection with auto-retry
  const {
    status: mqttStatus,
    retryCount,
    retry: retryMqttConnection,
  } = useMqttConnection({
    autoConnect: true,
    maxRetries: 3,
    enableAutoRetry: true,
  })

  // Focus on specific device if deviceId provided
  useEffect(() => {
    if (deviceId && markers.length > 0) {
      const targetMarker = markers.find((m) => m.id === deviceId)
      if (targetMarker) {
        animateToCoordinate(targetMarker.coordinate)
      }
    }
  }, [deviceId, markers])

  // Listen to live GPS and camera updates
  useEffect(() => {
    const unsubscribeGps = gpsFeedService.onLocationUpdate((location) => {
      const newCoordinate = {
        latitude: location.lat,
        longitude: location.lon,
      }

      animateToCoordinate(newCoordinate)

      const newMarker: MapMarker = {
        id: "current-location",
        coordinate: newCoordinate,
        title: "Michael Turner",
        description: "Toyota Camry • Black",
      }
      addMarker(newMarker)
    })

    const unsubscribeCamera = cameraUploadService.onImageReceived((data) => {
      const imageUri = `data:image/${data?.type || "jpeg"};base64,${data?.b64}`
      setCameraImage(imageUri)
      setIsLoadingImage(false)
    })

    return () => {
      unsubscribeGps()
      unsubscribeCamera()
    }
  }, [])

  const handleMarkerPress = useCallback((marker: MapMarker) => {
    const markerData = {
      id: marker.id,
      name: marker?.title || "Unknown Driver",
      vehicle: {
        make: "Toyota",
        model: "Camry",
        color: "Black",
      },
      licensePlate: "6KTC491",
      status: "Active" as const,
    }

    setSelectedMarkerInfo(markerData)
    bottomSheetRef.current?.present()
  }, [])

  const handleRequestImage = useCallback(() => {
    bottomSheetRef.current?.dismiss()

    setIsLoadingImage(true)
    setCameraImage(null)

    setTimeout(() => {
      imageViewerRef.current?.present()
    }, 300)

    const command = JSON.stringify({
      action: "capture",
      quality: 12,
    })
    cameraCommandService.sendCommand(command)

    setTimeout(() => {
      if (isLoadingImage) {
        setIsLoadingImage(false)
      }
    }, 15000)
  }, [isLoadingImage])

  const handleViewHistory = useCallback(() => {
    bottomSheetRef.current?.dismiss()
    navigation.navigate("History", {
      screen: "HistoryScreen",
      params: { deviceId: selectedMarkerInfo?.id },
    })
  }, [selectedMarkerInfo, navigation])

  return (
    <View style={themed($container)}>
      <SharedMapView ref={mapRef} region={region}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
          >
            <SvgIcon icon="Car" size={50} />
          </Marker>
        ))}
      </SharedMapView>

      <MarkerInfoSheet
        ref={bottomSheetRef}
        markerInfo={selectedMarkerInfo}
        onRequestImage={handleRequestImage}
        onCall={() => console.log("Call driver")}
        onViewHistory={handleViewHistory}
      />

      <ImageViewerSheet ref={imageViewerRef} imageUri={cameraImage} isLoading={isLoadingImage} />

      <ConnectionStatusBadge status={mqttStatus} retryCount={retryCount} />
      <RetryConnectionButton visible={mqttStatus === "error"} onRetry={retryMqttConnection} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

export default LiveMapScreen
