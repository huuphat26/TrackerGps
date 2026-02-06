import React, { FC, useEffect } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { MotiView, MotiText } from "moti"
import { imageRegistry } from "@assets/images"
import { ThemedStyle } from "@/theme/types"
import { useAppTheme } from "@/theme/context"

import { useNavigation } from "@react-navigation/native"
import { useAuth } from "@/context/AuthContext"
import { UserServices } from "@/services/api"
import { navigationRef, NavigationService } from "@/navigators/navigationUtilities"

interface SplashScreenProps {}
const SplashScreen: FC<SplashScreenProps> = () => {
  const { themed } = useAppTheme()
  const { authToken, setUser } = useAuth()

  useEffect(() => {
    const initApp = async () => {
      const startTime = Date.now()

      // Đợi navigation sẵn sàng
      const waitForNavigation = () => {
        return new Promise<void>((resolve) => {
          const checkReady = () => {
            if (navigationRef.isReady()) {
              resolve()
            } else {
              setTimeout(checkReady, 50)
            }
          }
          checkReady()
        })
      }

      await waitForNavigation()

      if (authToken) {
        try {
          const res = await UserServices.getUser()
          if (res.statusCode === 200 && res.data) {
            setUser(res.data)
            const elapsedTime = Date.now() - startTime
            const waitTime = Math.max(0, 2000 - elapsedTime)
            setTimeout(() => {
              NavigationService.reset({
                index: 0,
                routes: [{ name: "MainTab" }],
              })
            }, waitTime)
          } else {
            const elapsedTime = Date.now() - startTime
            const waitTime = Math.max(0, 2000 - elapsedTime)
            setTimeout(() => {
              NavigationService.reset({
                index: 0,
                routes: [{ name: "Auth" }],
              })
            }, waitTime)
          }
        } catch (error) {
          const elapsedTime = Date.now() - startTime
          const waitTime = Math.max(0, 2000 - elapsedTime)
          setTimeout(() => {
            NavigationService.reset({
              index: 0,
              routes: [{ name: "Auth" }],
            })
          }, waitTime)
        }
      } else {
        const elapsedTime = Date.now() - startTime
        const waitTime = Math.max(0, 2000 - elapsedTime)
        setTimeout(() => {
          NavigationService.reset({
            index: 0,
            routes: [{ name: "Auth" }],
          })
        }, waitTime)
      }
    }

    initApp()
  }, [])

  return (
    <View style={themed($container)}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "timing",
          duration: 500,
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
          duration: 500,
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
  borderRadius: 12,
})

const $title: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  fontSize: 32,
  fontFamily: typography.primary.bold,
  color: colors.text,
  textAlign: "center",
})
