import React, { FC, useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { MotiView, MotiText } from "moti"
import { imageRegistry } from "@assets/images"
import { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"

import { useNavigation } from "@react-navigation/native"

interface SplashScreenProps {}
const SplashScreen: FC<SplashScreenProps> = () => {
  const { themed } = useAppTheme()
  const navigation = useNavigation<any>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={themed($container)}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "timing",
          duration: 1000,
        }}
        style={themed($logoContainer)}
      >
        <Image source={imageRegistry.appIconAll} style={themed($logo)} />
      </MotiView>

      <MotiText
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: "timing",
          duration: 1000,
          delay: 500,
        }}
        style={themed($title)}
      >
        Gps Tracker
      </MotiText>
    </View>
  )
}
export default SplashScreen
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
  alignItems: "center",
  justifyContent: "center",
})

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $logo: ThemedStyle<ImageStyle> = () => ({
  width: 120,
  height: 120,
  resizeMode: "contain",
})

const $title: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 32,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
})
