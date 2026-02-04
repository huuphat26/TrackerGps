import { forwardRef, ReactNode } from "react"
import { StyleSheet } from "react-native"
import MapView, { MapViewProps, PROVIDER_GOOGLE, Region } from "react-native-maps"

export interface SharedMapViewProps extends Omit<MapViewProps, "children"> {
  /**
   * Initial region to display
   */
  region?: Region
  /**
   * Custom map content (markers, polylines, etc.)
   */
  children?: ReactNode
}

/**
 * Shared MapView component used across Live and History screens.
 * Wraps react-native-maps with consistent styling and Google Maps provider.
 */
export const SharedMapView = forwardRef<MapView, SharedMapViewProps>((props, ref) => {
  const { region, children, style, ...restProps } = props

  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      region={region}
      {...restProps}
    >
      {children}
    </MapView>
  )
})

SharedMapView.displayName = "SharedMapView"

const styles = StyleSheet.create({
  map: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
})
