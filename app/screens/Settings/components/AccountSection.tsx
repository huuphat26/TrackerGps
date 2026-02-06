import { View, ViewStyle, TouchableOpacity, ImageStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"
import { useAuth } from "@/context/AuthContext"
import { useProfile } from "@/services/queries/User/useProfile"
import { colors } from "@/theme/colors"
import { ImageCache } from "@/components"

export const AccountSection = () => {
  const { themed } = useAppTheme()
  const { logout } = useAuth()
  const { data: user } = useProfile()

  return (
    <View style={themed($sectionCard)}>
      <View style={themed($profileContainer)}>
        <View style={themed($avatarContainer)}>
          <ImageCache
            key={user?.id}
            uri={
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
            }
            style={themed($avatar)}
            resizeMode="cover"
            placeholder={<View style={themed($avatar)} />}
            fallback={<View style={themed($avatar)} />}
          />
        </View>
        <Text
          text={user?.name || "Tên người dùng"}
          preset="heading-h4"
          color={colors.text}
          weight="semiBold"
        />
        <Text
          text={user?.email || "Chưa cập nhật"}
          preset="body-3"
          color={colors.textDim}
          weight="normal"
        />

        <TouchableOpacity
          style={themed($logoutButton)}
          activeOpacity={0.8}
          onPress={() => logout()}
        >
          <Text text="Log Out" preset="button-3" weight="medium" color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $sectionCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: spacing.lg,
  padding: spacing.md,
  marginBottom: spacing.lg,
})

const $profileContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.sm,
  gap: spacing.xs,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  width: spacing.xxxl + spacing.md,
  height: spacing.xxxl + spacing.md,
  borderRadius: 999,
  backgroundColor: colors.palette.neutral300,
  marginBottom: spacing.xs,
  overflow: "hidden",
  borderWidth: spacing.xxxs,
  borderColor: "rgba(0, 122, 255, 0.1)",
})

const $avatar: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  width: spacing.xxxl + spacing.md,
  height: spacing.xxxl + spacing.md,
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.xs,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})
