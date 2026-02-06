import React, { FC, useState } from "react"
import {
  Image,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  TouchableOpacity,
  Keyboard,
} from "react-native"
import { Button, Screen, Text } from "../../components"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { imageRegistry } from "@assets/images"
import SvgIcon from "@/components/SvgIcon"
import TextField from "@/components/TextField"
import { NavigationService } from "@/navigators/navigationUtilities"
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/context/AuthContext"
import { RegisterRequest } from "@/services/api"
import { LoadingGlobalRef } from "@/components/LoadingGlobal"
import { showToast } from "@/utils/toastService"

interface SignupScreenProps {}

const SignupScreen: FC<SignupScreenProps> = () => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const { register, isLoading } = useAuth()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSignUp = async (data: RegisterRequest) => {
    Keyboard.dismiss()
    LoadingGlobalRef.current?.start()
    try {
      await register(data)
      showToast({
        message: "Đăng ký thành công",
        type: "SUCCESS",
        duration: 3000,
      })
      NavigationService.navigate("Auth", { screen: "SigninScreen" })
    } catch (error) {
      showToast({
        message: "Email đã tồn tại",
        type: "ERROR",
        duration: 2000,
      })
    } finally {
      LoadingGlobalRef.current?.end()
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={themed($logoContainer)}>
        <Image source={imageRegistry.appIconAll} style={themed($logo)} />
        <Text text="Tạo tài khoản mới" preset="heading" style={themed($title)} />
      </View>

      <View style={themed($formContainer)}>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Họ và tên không được để trống" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              containerStyle={themed($textField)}
              inputWrapperStyle={themed($inputWrapper)}
              placeholder="Họ và tên"
              autoCapitalize="words"
              leftIcon="User"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              subText={errors.name?.message}
              status={errors.name ? "danger" : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email không được để trống",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Email không hợp lệ",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              containerStyle={themed($textField)}
              inputWrapperStyle={themed($inputWrapper)}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="User"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              subText={errors.email?.message}
              status={errors.email ? "danger" : undefined}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Mật khẩu không được để trống",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              containerStyle={themed($textField)}
              inputWrapperStyle={themed($inputWrapper)}
              placeholder="Mật khẩu"
              secureTextEntry={isAuthPasswordHidden}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              subText={errors.password?.message}
              status={errors.password ? "danger" : undefined}
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
          )}
        />

        <Button
          text="Đăng ký"
          style={themed($button)}
          textStyle={themed($buttonText)}
          onPress={handleSubmit(onSignUp)}
          isLoading={isLoading}
        />
      </View>

      <View style={themed($footerContainer)}>
        <TouchableOpacity
          onPress={() =>
            NavigationService.navigate("Auth", {
              screen: "SigninScreen",
            })
          }
        >
          <Text style={themed($footerText)}>
            Đã có tài khoản? <Text text="Đăng nhập ngay" style={themed($link)} />
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

export default SignupScreen

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
