import { StyleProp, ViewStyle } from "react-native"
import { Toast } from "react-native-toast-notifications"

enum ToastType {
  SUCCESS = "success",
  ERROR = "danger",
  WARNING = "warning",
  CUSTOM = "custom",
  NORMAL = "normal",
}

enum ToastPosition {
  TOP = "top",
  BOTTOM = "bottom",
  CENTER = "center",
}

//Tạo liên kết lỏng với enum ToastType
export type IToastType = keyof typeof ToastType
export type IToastPosition = keyof typeof ToastPosition

export const showToast = ({
  message = "System notification",
  type = "NORMAL",
  position = "TOP",
  duration = 10000,
  animationDuration = 100,
  style,
}: {
  message: string
  type: IToastType
  position?: IToastPosition
  duration?: number
  animationDuration?: number
  style?: StyleProp<ViewStyle>
}) => {
  const toastType = ToastType[type.toUpperCase() as keyof typeof ToastType] || ToastType.ERROR
  const toastPosition =
    ToastPosition[position.toUpperCase() as keyof typeof ToastPosition] || ToastPosition.TOP

  // console.log('toastType', toastType);
  // console.log('toastPosition', toastPosition);

  Toast.show(message ?? "No toast message", {
    type: toastType.toLocaleLowerCase(),
    placement: toastPosition,
    duration,
    animationDuration,
    style,
  })
}
