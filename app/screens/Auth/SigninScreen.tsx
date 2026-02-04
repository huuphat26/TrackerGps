import React, { FC, useState } from "react"
import { Image, TextStyle, View, ViewStyle, ImageStyle, TouchableOpacity } from "react-native"
import { Button, Screen, Text } from "../../components"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { imageRegistry } from "@assets/images"
import SvgIcon from "@/components/SvgIcon"
import TextField from "@/components/TextField"
import { useNavigation } from "@react-navigation/native"

interface SigninScreenProps {}

const SigninScreen: FC<SigninScreenProps> = () => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const navigation = useNavigation<any>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={themed($logoContainer)}>
        <Image source={imageRegistry.appIconAll} style={themed($logo)} />
        <Text text="Chào mừng quay lại" preset="heading" style={themed($title)} />
      </View>

      <View style={themed($formContainer)}>
        <TextField
          containerStyle={themed($textField)}
          inputWrapperStyle={themed($inputWrapper)}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          leftIcon="NumPad"
        />

        <TextField
          containerStyle={themed($textField)}
          inputWrapperStyle={themed($inputWrapper)}
          placeholder="Mật khẩu"
          secureTextEntry={isAuthPasswordHidden}
          RightAccessory={() => (
            <TouchableOpacity onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}>
              <SvgIcon
                name={isAuthPasswordHidden ? "EyeOff" : "EyeActive"}
                size={20}
                fill={colors.textDim}
              />
            </TouchableOpacity>
          )}
        />

        <Button
          text="Đăng nhập"
          style={themed($button)}
          textStyle={themed($buttonText)}
          onPress={() => {}}
        />
      </View>

      <View style={themed($footerContainer)}>
        <Text style={themed($footerText)}>
          Bạn chưa có tài khoản?{" "}
          <Text
            text="Đăng ký ngay"
            style={themed($link)}
            onPress={() => navigation.navigate("SignupScreen")}
          />
        </Text>
      </View>
    </Screen>
  )
}

export default SigninScreen

const $screenContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-between",
})

const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.xxxl,
})

const $logo: ThemedStyle<ImageStyle> = () => ({
  height: 90,
  width: 90,
  resizeMode: "contain",
  borderRadius: 16,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  fontSize: 28,
  textAlign: "center",
})

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $inputWrapper: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral100,
  height: 56,
  alignItems: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.primary,
  marginTop: spacing.lg,
  minHeight: 52,
  borderRadius: 26,
  borderWidth: 0,
})

const $buttonText: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
})

const $footerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
  alignItems: "center",
})

const $footerText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  fontSize: 14,
})

const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})
