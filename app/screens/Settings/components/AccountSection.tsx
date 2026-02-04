import { View, ViewStyle, Image, TouchableOpacity, TextStyle } from "react-native"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import { ThemedStyle } from "@/theme/types"

export const AccountSection = () => {
  const { themed } = useAppTheme()
  return (
    <View style={themed($sectionCard)}>
      <View style={themed($profileContainer)}>
        <View style={themed($avatarContainer)}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            }}
            style={themed($avatar)}
          />
        </View>
        <Text text="user@example.com" preset="bold" style={themed($emailText)} />
        <Text text="Premium Member" style={themed($membershipText)} />
        <TouchableOpacity style={themed($logoutButton)} activeOpacity={0.7}>
          <Text text="Log Out" style={themed($logoutText)} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $sectionCard: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.md,
  marginBottom: spacing.lg,
})

const $profileContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
  paddingVertical: 8,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.neutral300,
  marginBottom: 16,
  overflow: "hidden",
  borderWidth: 4,
  borderColor: "rgba(0, 122, 255, 0.1)",
})

const $avatar: ThemedStyle<any> = () => ({
  width: "100%",
  height: "100%",
})

const $emailText: ThemedStyle<TextStyle> = () => ({
  fontSize: 20,
  marginBottom: 4,
})

const $membershipText: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 14,
  color: colors.textDim,
  marginBottom: 20,
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ colors }) => ({
  paddingVertical: 10,
  paddingHorizontal: 40,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
})

const $logoutText: ThemedStyle<TextStyle> = () => ({
  color: "#FF3B30",
  fontWeight: "bold",
})
