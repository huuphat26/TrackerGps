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
import { useNavigation } from "@react-navigation/native"
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/context/AuthContext"
import { LoginRequest, UserServices } from "@/services/api"
import { LoadingGlobalRef } from "@/components/LoadingGlobal"
import { NavigationService } from "@/navigators/navigationUtilities"

interface SigninScreenProps {}

const SigninScreen: FC<SigninScreenProps> = () => {
  const {
    themed,
    theme: { colors },
  } = useAppTheme()
  const navigation = useNavigation<any>()
  const { login } = useAuth()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "huuphat263@gmail.com", //hard
      password: "Admin@123",
    },
  })

  const onSignIn = async (data: LoginRequest) => {
    Keyboard.dismiss()
    LoadingGlobalRef.current?.start()
    try {
      await login(data)
    } catch (error) {
      console.log("Error", error)
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
        <Text text="Chào mừng quay lại" preset="heading-h3" weight="semiBold" />
      </View>

      <View style={themed($formContainer)}>
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
          text="Đăng nhập"
          style={themed($button)}
          onPress={handleSubmit(onSignIn)}
          // isLoading={isLoading}
          textStyle={{
            color: colors.white,
          }}
        />
      </View>

      <View style={themed($footerContainer)}>
        <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
          <Text preset="body-1" color={colors.text} weight="medium">
            Bạn chưa có tài khoản?{" "}
            <Text text="Đăng ký ngay" preset="body-1" color={colors.textDim} weight="normal" />
          </Text>
        </TouchableOpacity>
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
  gap: spacing.md,
})

const $logo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: spacing.xxxl + spacing.lg,
  width: spacing.xxxl + spacing.lg,
  resizeMode: "contain",
  borderRadius: spacing.md,
})

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $inputWrapper: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  borderRadius: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral100,
  height: spacing.xxl + spacing.xs,
  alignItems: "center",
})

const $button: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.primary,
  marginTop: spacing.lg,
  minHeight: spacing.xxl,
  borderRadius: spacing.sm,
  borderWidth: 0,
})

const $footerContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
  alignItems: "center",
})

const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontWeight: "600",
})
