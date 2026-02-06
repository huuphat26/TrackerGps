import { memo, useEffect, useState } from "react"
import type { ReactNode } from "react"
import {
  ActivityIndicator,
  Image,
  ImageResizeMode,
  ImageStyle,
  StyleProp,
  View,
} from "react-native"

import { getCachedValidity, setCachedValidity } from "./imageCacheIndex"
import CustomImage from "./ImageCustom"

type ImageCacheProps = {
  uri?: string | null
  style?: StyleProp<ImageStyle>
  resizeMode?: ImageResizeMode
  placeholder?: ReactNode
  fallback?: ReactNode
  enablePrefetch?: boolean
}

export const ImageCache = memo(function ImageCache({
  uri,
  style,
  resizeMode = "cover",
  placeholder,
  fallback,
  enablePrefetch = true,
}: ImageCacheProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!uri || !enablePrefetch) return

    // Nếu đã có trong cache validity, không cần validate lại
    const cached = getCachedValidity(uri)
    if (cached !== null) return

    // Validate ở background để update cache validity
    // Không chặn render, chỉ để optimize cho lần sau
    Image.prefetch(uri)
      .then((ok) => {
        const valid = !!ok
        setCachedValidity(uri, valid)
      })
      .catch(() => {
        setCachedValidity(uri, false)
      })
  }, [uri, enablePrefetch])

  if (!uri) {
    return fallback ? <>{fallback}</> : <View style={style} />
  }

  // Nếu đã có lỗi từ CachedImage, fallback sang Image thông thường
  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }
    // Fallback sang Image thông thường nếu gặp lỗi
    return (
      <Image
        source={{ uri }}
        style={style}
        resizeMode={resizeMode}
        onError={() => {
          setHasError(true)
        }}
      />
    )
  }

  // Render CustomImage logic
  return (
    <CustomImage
      source={{ uri }}
      style={style}
      resizeMode={resizeMode}
      onError={(error: any) => {
        // Nếu là lỗi "Destination already exists", fallback sang Image thông thường
        setHasError(true)
        setCachedValidity(uri, false)
      }}
      placeholderContent={
        placeholder ?? (
          <ActivityIndicator
            size="small"
            style={[{ alignItems: "center", justifyContent: "center" }, style as any]}
          />
        )
      }
    />
  )
})

export default ImageCache
