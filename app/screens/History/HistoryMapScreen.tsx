import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { FC, useEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import SvgIcon from "@/components/SvgIcon"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { CompositeScreenProps } from "@react-navigation/native"
import { AppStackParamList } from "@/navigators/navigationTypes"
import { HistoryStackParamList } from "./HistoryStack"
import { useHistoryData, HistoryLogEntry } from "@/services/maps/useHistoryData"
import { Marker, Polyline } from "react-native-maps"
import { useMap } from "@/services/maps"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { SharedMapView } from "@/components/Map"
import { HistorySheet } from "./components/HistorySheet"

type Props = CompositeScreenProps<
  NativeStackScreenProps<HistoryStackParamList, "HistoryMapScreen">,
  NativeStackScreenProps<AppStackParamList>
>

/**
 * HistoryMapScreen - Dedicated screen for viewing historical route playback
 *
 * Responsibilities:
 * - Fetch and display historical GPS data
 * - Render polyline route
 * - Playback controls (play/pause, progress)
 * - Animate marker along route
 */
const HistoryMapScreen: FC<Props> = ({ route }) => {
  const { deviceId } = route.params || {}

  const { themed, theme } = useAppTheme()
  const { mapRef, region, animateToCoordinate } = useMap()
  const { fetchHistory } = useHistoryData()

  const historySheetRef = useRef<BottomSheetModal | null>(null)

  const [historyPoints, setHistoryPoints] = useState<HistoryLogEntry[]>([])
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load history data on mount
  useEffect(() => {
    const loadHistory = async () => {
      const data = await fetchHistory(new Date(), deviceId || "1")
      setHistoryPoints(data)
      if (data.length > 0) {
        animateToCoordinate(data[0].coordinate)
        historySheetRef.current?.present()
      }
    }
    loadHistory()
  }, [deviceId])

  // Handle playback animation
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
    } else if (playInterval.current) {
      clearInterval(playInterval.current)
    }
    return () => {
      if (playInterval.current) clearInterval(playInterval.current)
    }
  }, [isPlaying, historyPoints])

  return (
    <View style={themed($container)}>
      <SharedMapView ref={mapRef} region={region}>
        {historyPoints.length > 0 && (
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
      </SharedMapView>

      <HistorySheet
        ref={historySheetRef}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        progress={currentPlayIndex / (historyPoints.length - 1 || 1)}
        onSliderChange={(val: number) =>
          setCurrentPlayIndex(Math.floor(val * (historyPoints.length - 1)))
        }
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

export default HistoryMapScreen
