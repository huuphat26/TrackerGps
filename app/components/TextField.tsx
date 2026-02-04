import { useMemo, useState, forwardRef } from "react"
import {
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

import type { ISvgType } from "@assets/svg"

import SvgIcon from "@/components/SvgIcon"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type TextFieldSize = "lg" | "md" | "sm" | "xs"
export type TextFieldStatus = "default" | "success" | "warning" | "danger" | "info"

export interface AccessoryProps {
  style?: StyleProp<ViewStyle>
}

export interface TextFieldProps extends Omit<TextInputProps, "style" | "onChange"> {
  label?: string
  required?: boolean
  size?: TextFieldSize
  status?: TextFieldStatus
  subText?: string
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  LeftAccessory?: React.ComponentType<AccessoryProps>
  RightAccessory?: React.ComponentType<AccessoryProps>
  leftIcon?: ISvgType
  rightIcon?: ISvgType
  onLeftPress?: () => void
  onRightPress?: () => void
  disabled?: boolean
  labelColor?: string
  labelStyle?: StyleProp<TextStyle>
  fillColor?: string
  inputWrapperStyle?: StyleProp<ViewStyle>
  onFocus?: () => void
  onBlur?: () => void
}
const TextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
  const {
    label,
    required,
    size = "md",
    status = "default",
    subText,
    containerStyle,
    inputStyle,
    LeftAccessory,
    RightAccessory,
    leftIcon,
    rightIcon,
    onLeftPress,
    onRightPress,
    disabled,
    secureTextEntry,
    labelColor: _labelColor,
    labelStyle,
    fillColor,
    inputWrapperStyle,
    onFocus,
    onBlur,
    ...textInputProps
  } = props

  const { theme, themed } = useAppTheme()
  const { colors, typography } = theme

  const [focused, setFocused] = useState(false)

  const dims = useMemo(() => getSizeDimensions(size), [size])

  function getBorderColor(): string {
    if (disabled) return colors.border
    if (status === "danger") return colors.error as string
    if (focused) return "#EEEEEE"
    switch (status) {
      case "success":
        return colors.primary as string
      case "warning":
        return colors.palette.accent500 as string
      case "info":
        return colors.palette.secondary400 as string
      case "default":
        return colors.border as string
      default:
        return colors.border as string
    }
  }

  function getSubTextColor(): string | undefined {
    switch (status) {
      case "danger":
        return colors.error as string
      case "success":
        return colors.primary as string
      case "warning":
        return colors.palette.accent500 as string
      case "info":
        return colors.palette.secondary400 as string
      default:
        return undefined
    }
  }

  function getValueColor(): string {
    if (disabled) return colors.textSecondary as string
    if (status === "danger") return colors.error as string
    if (focused) return colors.text as string
    switch (status) {
      case "success":
        return colors.primary as string
      case "warning":
        return colors.palette.accent500 as string
      case "info":
        return colors.palette.secondary400 as string
      case "default":
      default:
        return colors.text as string
    }
  }

  const isMultiline = !!textInputProps.multiline
  const lineHeight = Math.round(dims.fontSize * 1.25)
  const maxLines = 5 // cap at 7 lines
  const maxHeight = lineHeight * maxLines // + paddingVertical

  return (
    <View style={containerStyle}>
      {!!label && (
        <View style={$labelContainer}>
          <Text
            preset="title-2"
            weight="medium"
            color={(getSubTextColor() ?? colors.text) as string}
            style={labelStyle}
          >
            {label}
          </Text>
          {required && (
            <Text preset="title-2" weight="bold" color={colors.error as string}>
              *
            </Text>
          )}
        </View>
      )}

      {/* Wrap the entire input area with a Pressable to allow tapping anywhere to focus */}
      <Pressable
        style={[
          themed($inputWrapper),
          {
            borderRadius: dims.radius,
            paddingHorizontal: dims.paddingHorizontal,
            backgroundColor: "#F7F7F8",
            borderColor: getBorderColor(),
          },
          disabled && themed($disabledInputWrapper),
          inputWrapperStyle,
        ]}
        pointerEvents={disabled ? "none" : "auto"}
      >
        {!!LeftAccessory && <LeftAccessory style={$leftAccessory} />}
        {!!leftIcon && (
          <Pressable onPress={() => onLeftPress && onLeftPress()}>
            <SvgIcon icon={leftIcon} size={20} fill={getValueColor() ?? "#fff"} />
          </Pressable>
        )}
        <TextInput
          ref={ref}
          placeholderTextColor={colors.textSecondary as string}
          style={[
            themed($textInput),
            {
              color: (getValueColor() ?? colors.text) as string,
              fontFamily: typography.primary.normal,
              fontSize: dims.fontSize,
              lineHeight: lineHeight,
              maxHeight: isMultiline ? maxHeight : undefined,
            },
            Platform.OS === "ios" && themed($iosTextInput),
            inputStyle,
          ]}
          onFocus={() => {
            setFocused(true)
            onFocus?.()
          }}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          {...textInputProps}
          scrollEnabled={isMultiline ? true : (textInputProps.scrollEnabled as any)}
          onBlur={() => {
            setFocused(false)
            onBlur?.()
          }}
        />
        {!!rightIcon && (
          <Pressable onPress={onRightPress} hitSlop={8} disabled={!onRightPress}>
            <SvgIcon icon={rightIcon} size={20} fill={fillColor ?? "#fff"} />
          </Pressable>
        )}
        {!!RightAccessory && <RightAccessory style={$rightAccessory} />}
      </Pressable>

      {!!subText && (
        <View style={$subTextContainer}>
          <View
            style={[
              $subTextDot,
              {
                backgroundColor: getSubTextColor() ?? colors.textDim,
              },
            ]}
          />
          <Text preset="body-3" color={(getSubTextColor() ?? colors.textDim) as string}>
            {subText}
          </Text>
        </View>
      )}
    </View>
  )
})
TextField.displayName = "TextField"
export default TextField
// --- styles ---

const $gradient: ViewStyle = {
  bottom: 0,
  left: 0,
  position: "absolute",
  right: 0,
  top: 0,
}

const $inputWrapper: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  alignItems: "center",
  backgroundColor: "#F7F7F8",
  borderRadius: 16,
  borderWidth: 1,
  flexDirection: "row",
  gap: 8,
  overflow: "hidden",
  paddingHorizontal: spacing.sm,
})

const $labelContainer: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  gap: 5,
  marginBottom: 6,
}

const $leftAccessory: ViewStyle = {
  marginRight: 4,
}

const $rightAccessory: ViewStyle = {
  marginLeft: 4,
}

const $subTextContainer: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  gap: 6,
  marginTop: 6,
}

const $subTextDot: ViewStyle = {
  borderRadius: 6,
  height: 6,
  width: 6,
}

const $textInput: ViewStyle = {
  flex: 1,
}

const $iosTextInput: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.md,
})

const $disabledInputWrapper: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.6,
})

// --- helpers ---

type SizeDims = {
  height: number
  paddingHorizontal: number
  radius: number
  fontSize: number
}

const SIZE_DIMENSIONS: Record<TextFieldSize, SizeDims> = {
  lg: { height: 48, paddingHorizontal: 16, radius: 16, fontSize: 16 },
  md: { height: 40, paddingHorizontal: 14, radius: 16, fontSize: 14 },
  sm: { height: 36, paddingHorizontal: 12, radius: 16, fontSize: 13 },
  xs: { height: 32, paddingHorizontal: 10, radius: 16, fontSize: 12 },
}

function getSizeDimensions(size: TextFieldSize): SizeDims {
  return SIZE_DIMENSIONS[size] ?? SIZE_DIMENSIONS.md
}
