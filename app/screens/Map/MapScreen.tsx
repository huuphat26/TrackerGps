import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import SvgIcon from "@/components/SvgIcon"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { MapStackParamList } from "./MapStack"
import { MarkerInfoSheet, MarkerInfo } from "./MarkerInfoSheet"
import { ImageViewerSheet } from "./ImageViewerSheet"
import { HistorySheet } from "./HistorySheet"
import { useHistoryData, HistoryLogEntry } from "@/services/maps/useHistoryData"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { cameraCommandService } from "@/services/mqtt/CameraCommandService"
import { useMap } from "@/services/maps"
import { MapMarker } from "@/services/maps/MapService"
import { useMqtt } from "@/services/mqtt"
import { cameraUploadService } from "@/services/mqtt/CameraUploadService"
import { gpsFeedService } from "@/services/mqtt/GpsFeedService"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import Config from "@/config"

type Props = CompositeScreenProps<
  NativeStackScreenProps<MapStackParamList, "MapScreen">,
  NativeStackScreenProps<AppStackParamList>
>

const MapScreen: FC<Props> = ({ navigation, route }) => {
  const { mode, deviceId } = route.params || {}

  const { themed, theme } = useAppTheme()
  const { mapRef, region, markers, addMarker, animateToCoordinate } = useMap()
  const { fetchHistory } = useHistoryData()

  const bottomSheetRef = useRef<BottomSheetModal | null>(null)
  const imageViewerRef = useRef<BottomSheetModal | null>(null)
  const historySheetRef = useRef<BottomSheetModal | null>(null)

  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<MarkerInfo | null>(null)
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  const [historyPoints, setHistoryPoints] = useState<HistoryLogEntry[]>([])
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const { connect } = useMqtt()

  useEffect(() => {
    if (mode === "history") {
      const loadHistory = async () => {
        const data = await fetchHistory(new Date(), "1")
        setHistoryPoints(data)
        if (data.length > 0) {
          animateToCoordinate(data[0].coordinate)
          historySheetRef.current?.present()
        }
      }
      loadHistory()
    }
  }, [mode])

  useEffect(() => {
    if (isPlaying) {
      playInterval.current = setInterval(() => {
        setCurrentPlayIndex((prev) => {
          if (prev >= historyPoints.length - 1) {
            setIsPlaying(false)
            return prev
          }
          const next = prev + 1
          animateToCoordinate(historyPoints[next].coordinate)
          return next
        })
      }, 1000)
    } else {
      if (playInterval.current) clearInterval(playInterval.current)
    }
    return () => {
      if (playInterval.current) clearInterval(playInterval.current)
    }
  }, [isPlaying, historyPoints])

  useEffect(() => {
    if (mode === "live" && deviceId && markers.length > 0) {
      const targetMarker = markers.find((m) => m.id === deviceId)
      if (targetMarker) {
        animateToCoordinate(targetMarker.coordinate)
      }
    }
  }, [mode, deviceId, markers])

  useEffect(() => {
    const connectMqtt = async () => {
      if (mode === "history") return // Don't connect MQTT in history mode if not needed

      if (Config.ADAFRUIT.username && Config.ADAFRUIT.aioKey) {
        await connect({
          username: Config.ADAFRUIT.username,
          aioKey: Config.ADAFRUIT.aioKey,
        })
      } else {
        console.warn("Missing Adafruit credentials in Config")
      }
    }
    connectMqtt()
  }, [mode])

  useEffect(() => {
    if (mode === "history") return // Don't listen to live updates in history mode

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
  }, [mode])

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
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={region}>
        {mode !== "history" &&
          markers.map((marker) => (
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

        {mode === "history" && historyPoints.length > 0 && (
          <>
            <Polyline
              coordinates={historyPoints.map((p) => p.coordinate)}
              strokeWidth={4}
              strokeColor={theme.colors.brand.primary}
            />
            <Marker coordinate={historyPoints[currentPlayIndex].coordinate}>
              <SvgIcon icon="Car" size={40} fill={theme.colors.brand.primary} />
            </Marker>
          </>
        )}
      </MapView>

      <MarkerInfoSheet
        ref={bottomSheetRef}
        markerInfo={selectedMarkerInfo}
        onRequestImage={handleRequestImage}
        onCall={() => console.log("Call driver")}
        onViewHistory={handleViewHistory}
      />

      <ImageViewerSheet ref={imageViewerRef} imageUri={cameraImage} isLoading={isLoadingImage} />

      <HistorySheet
        ref={historySheetRef}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        progress={currentPlayIndex / (historyPoints.length - 1 || 1)}
        onSliderChange={(val) => setCurrentPlayIndex(Math.floor(val * (historyPoints.length - 1)))}
        stats={{
          distance: "12.5 km",
          duration: "45m",
          avgSpeed: "28 km/h",
        }}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

export default MapScreen
