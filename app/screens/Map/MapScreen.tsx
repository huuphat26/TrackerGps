import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import Config from "@/config"
import { useMap } from "@/services/maps/useMap"
import { useMqtt } from "@/services/mqtt/useMqtt"
import { gpsFeedService } from "@/services/mqtt/GpsFeedService"
import { cameraUploadService } from "@/services/mqtt/CameraUploadService"
import { cameraCommandService } from "@/services/mqtt/CameraCommandService"
import { MapMarker } from "@/services/maps/MapService"
import SvgIcon from "@/components/SvgIcon"
import { MarkerInfoSheet } from "./MarkerInfoSheet"
import { ImageViewerSheet } from "./ImageViewerSheet"

interface MapViewScreenProps {}
const MapScreen: FC<MapViewScreenProps> = () => {
  const { themed } = useAppTheme()
  const { mapRef, region, markers, addMarker, animateToCoordinate } = useMap()
  const { connect } = useMqtt()
  const bottomSheetRef = useRef<BottomSheetModal | null>(null)
  const imageViewerRef = useRef<BottomSheetModal | null>(null)
  const [selectedMarkerInfo, setSelectedMarkerInfo] = useState<any>(null)
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  useEffect(() => {
    const testCoordinate = {
      latitude: 10.8231,
      longitude: 106.6297,
    }

    animateToCoordinate(testCoordinate)
    const testMarker: MapMarker = {
      id: "test-location",
      coordinate: testCoordinate,
      title: "Michael Turner",
      description: "Toyota Camry • Black",
    }
    addMarker(testMarker)
  }, [])

  useEffect(() => {
    const connectMqtt = async () => {
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
  }, [])

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

  return (
    <View style={themed($container)}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={region}>
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
      </MapView>

      <MarkerInfoSheet
        ref={bottomSheetRef}
        markerInfo={selectedMarkerInfo}
        onRequestImage={handleRequestImage}
        onCall={() => console.log("Call driver")}
      />

      <ImageViewerSheet ref={imageViewerRef} imageUri={cameraImage} isLoading={isLoadingImage} />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

export default MapScreen
