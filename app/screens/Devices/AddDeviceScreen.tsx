import { useRegisterDevice } from "@/services/queries/Device/useDeviceQueries"
import React, { FC } from "react"
import { View, ViewStyle, TextStyle, Keyboard, ScrollView } from "react-native"
import { Button, Screen, Text } from "@/components"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import SvgIcon from "@/components/SvgIcon"
import TextField from "@/components/TextField"
import { useForm, Controller } from "react-hook-form"
import { showToast } from "@/utils/toastService"
import { NavigationService } from "@/navigators/navigationUtilities"
import { LoadingGlobalRef } from "@/components/LoadingGlobal"

interface AddDeviceFormData {
  deviceId?: string
  name: string
}

const AddDeviceScreen: FC = () => {
  const { mutateAsync: registerDevice } = useRegisterDevice()
  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddDeviceFormData>({
    defaultValues: {
      deviceId: "",
      name: "",
    },
  })

  const onSubmit = async (data: AddDeviceFormData) => {
    Keyboard.dismiss()
    LoadingGlobalRef.current?.start()
    try {
      const res = await registerDevice({
        deviceId: data?.deviceId || "",
        name: data?.name,
      })
      if (res.statusCode === 201) {
        showToast({
          message: "Thêm thiết bị thành công",
          type: "SUCCESS",
          duration: 3000,
        })
        NavigationService.replace("Devices", { screen: "DevicesScreen" })
      }
    } catch (error) {
      console.log("Failed to register device", error)
      showToast({
        message: "Thêm thiết bị thất bại",
        type: "ERROR",
        duration: 3000,
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
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={themed($iconSection)}>
          <View style={themed($iconContainer)}>
            <SvgIcon icon="Devices" size={56} fill={colors.brand.primary} />
          </View>
          <Text text="Kết nối thiết bị" preset="heading-h4" weight="bold" style={themed($title)} />
          <Text
            text="Nhập thông tin thiết bị để bắt đầu"
            preset="body-2"
            color={colors.textDim}
            style={themed($subtitle)}
          />
        </View>

        <View style={themed($formContainer)}>
          <Controller
            control={control}
            name="deviceId"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                containerStyle={themed($textField)}
                inputWrapperStyle={themed($inputWrapper)}
                placeholder="DEV-ABC123 (tùy chọn)"
                label="ID thiết bị"
                autoCapitalize="characters"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                subText={errors.deviceId?.message}
                status={errors.deviceId ? "danger" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="name"
            rules={{ required: "Tên thiết bị không được để trống" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                containerStyle={themed($textField)}
                inputWrapperStyle={themed($inputWrapper)}
                placeholder="Ví dụ: Xe Toyota"
                label="Tên thiết bị"
                autoCapitalize="words"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                subText={errors.name?.message}
                status={errors.name ? "danger" : undefined}
              />
            )}
          />

          <Button
            text="Thêm thiết bị"
            style={themed($button)}
            textStyle={themed($buttonText)}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const $screenContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  paddingHorizontal: spacing.lg,
})

const $iconSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginTop: spacing.xxxl,
  marginBottom: spacing.xl,
})

const $iconContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: 96,
  height: 96,
  borderRadius: 48,
  backgroundColor: colors.brand.secondary,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.md,
})

const $title: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  marginBottom: spacing.xxs,
})

const $subtitle: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
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
  backgroundColor: colors.brand.primary,
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

export default AddDeviceScreen
