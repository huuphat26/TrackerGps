import { FC, ReactNode, useState } from "react"
import {
  Image,
  View,
  StyleSheet,
  ImageProps,
  NativeSyntheticEvent,
  ImageErrorEventData,
} from "react-native"

// Chỉ mở rộng ImageProps để thêm placeholderContent
// Các props như source, resizeMode, style... đã có sẵn trong ImageProps
interface CustomImageProps extends ImageProps {
  placeholderContent?: ReactNode
}

const CustomImage: FC<CustomImageProps> = ({
  placeholderContent,
  style,
  onLoadStart,
  onLoadEnd,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  // Xử lý khi bắt đầu tải
  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
    // Gọi callback gốc nếu có
    if (onLoadStart) onLoadStart()
  }

  // Xử lý khi tải xong
  const handleLoadEnd = () => {
    setIsLoading(false)
    // Gọi callback gốc nếu có
    if (onLoadEnd) onLoadEnd()
  }

  // Xử lý khi lỗi
  const handleError = (e: NativeSyntheticEvent<ImageErrorEventData>) => {
    setIsLoading(false)
    setHasError(true)
    // Gọi callback gốc để component cha xử lý tiếp
    if (onError) onError(e)
  }

  return (
    <View style={[style, styles.container]}>
      <Image
        {...props}
        style={[StyleSheet.absoluteFill, styles.image]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />

      {/* Chỉ hiện placeholder khi đang loading VÀ chưa có lỗi */}
      {isLoading && !hasError && placeholderContent && (
        <View style={[StyleSheet.absoluteFill, styles.centerContent]}>{placeholderContent}</View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden", // Giữ content bên trong bo góc nếu style có borderRadius
  },
  image: {
    width: "100%",
    height: "100%",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
})

export default CustomImage
