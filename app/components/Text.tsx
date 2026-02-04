/* eslint-disable no-restricted-imports */
import { ReactNode, forwardRef, ForwardedRef } from "react"
// eslint-disable-next-line no-restricted-imports
import {
  StyleProp,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
  Platform,
} from "react-native"
import { TOptions } from "i18next"

import { isRTL, TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"
import { typography } from "@/theme/typography"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets =
  | "default"
  | "bold"
  | "heading"
  | "subheading"
  | "formLabel"
  | "formHelper"
  | "heading-h1"
  | "heading-h2"
  | "heading-h3"
  | "heading-h4"
  | "heading-h5"
  | "title-1"
  | "title-2"
  | "title-3"
  | "button-1"
  | "button-2"
  | "button-3"
  | "button-4"
  | "body-1"
  | "body-2"
  | "body-3"
  | "body-4"
  | "xxl"
  | "xl"
  | "lg"
  | "md"
  | "sm"
  | "xs"
  | "xxs"
  | "xxxs"

export interface TextProps extends RNTextProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TOptions
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * Text weight modifier.
   */
  weight?: Weights
  /**
   * Text size modifier.
   */
  size?: Sizes
  /**
   * Children components.
   */
  children?: ReactNode
  color?: string
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Text/}
 * @param {TextProps} props - The props for the `Text` component.
 * @returns {JSX.Element} The rendered `Text` component.
 */
export const Text = forwardRef(function Text(props: TextProps, ref: ForwardedRef<RNText>) {
  const {
    weight,
    size,
    tx,
    txOptions,
    text,
    children,
    color,
    style: $styleOverride,
    ...rest
  } = props
  const { themed } = useAppTheme()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = props.preset ?? "default"
  const $styles: StyleProp<TextStyle> = [
    $rtlStyle,
    themed($presets[preset]),
    color && { color },
    size && themed($presets[size]),
    weight && $fontWeightStyles[weight],
    $styleOverride,
  ]

  // On Android, large system font scale can break layouts.
  // Provide sane defaults while allowing explicit overrides via props.
  const defaultAllowFontScaling =
    rest.allowFontScaling ?? (Platform.OS === "android" ? false : true)
  const defaultMaxFontSizeMultiplier =
    rest.maxFontSizeMultiplier ?? (Platform.OS === "android" ? 1 : 0)

  return (
    <RNText
      {...rest}
      allowFontScaling={defaultAllowFontScaling}
      maxFontSizeMultiplier={defaultMaxFontSizeMultiplier}
      style={$styles}
      ref={ref}
    >
      {content}
    </RNText>
  )
})

export const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 13, lineHeight: 19.5 } satisfies TextStyle,
  xxxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
}

const $fontWeightStyles = Object.entries(typography.primary).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: ThemedStyle<TextStyle> = (theme) => ({
  ...$sizeStyles.sm,
  ...$fontWeightStyles.normal,
})

export const $presets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  "default": [$baseStyle],
  "bold": [$baseStyle, { ...$fontWeightStyles.bold }],
  "heading": [
    $baseStyle,
    {
      ...$sizeStyles.xxl,
      ...$fontWeightStyles.bold,
    },
  ],
  "subheading": [$baseStyle, { ...$sizeStyles.lg, ...$fontWeightStyles.medium }],
  "formLabel": [$baseStyle, { ...$fontWeightStyles.medium }],
  "formHelper": [$baseStyle, { ...$sizeStyles.sm, ...$fontWeightStyles.normal }],
  "heading-h1": [
    $baseStyle,
    { fontSize: 48, lineHeight: 57.6, fontFamily: typography.primary.bold },
  ],
  "heading-h2": [
    $baseStyle,
    { fontSize: 32, lineHeight: 38.4, fontFamily: typography.primary.semiBold },
  ],
  "heading-h3": [$baseStyle, { fontSize: 26, lineHeight: 28 }],
  "heading-h4": [
    $baseStyle,
    { fontSize: 22, lineHeight: 24, fontFamily: typography.primary.medium },
  ],
  "heading-h5": [$baseStyle, { fontSize: 18, lineHeight: 24 }],
  "title-1": [$baseStyle, { fontSize: 16, lineHeight: 20, fontFamily: typography.primary.normal }],
  "title-2": [$baseStyle, { fontSize: 14, lineHeight: 17.5 }],
  "title-3": [$baseStyle, { fontSize: 12, lineHeight: 16 }],
  "button-1": [$baseStyle, { fontSize: 16, lineHeight: 19.2 }],
  "button-2": [$baseStyle, { fontSize: 14, lineHeight: 16.8 }],
  "button-3": [
    $baseStyle,
    { fontSize: 12, lineHeight: 14.4, fontFamily: typography.primary.semiBold },
  ],
  "button-4": [$baseStyle, { fontSize: 10.5, lineHeight: 13 }],
  "body-1": [$baseStyle, { fontSize: 16, lineHeight: 22.4 }],
  "body-2": [$baseStyle, { fontSize: 14, lineHeight: 19.6 }],
  "body-3": [$baseStyle, { fontSize: 12, lineHeight: 16.8 }],
  "body-4": [$baseStyle, { fontSize: 10, lineHeight: 16.8 }],
  "xxl": [$baseStyle, { fontSize: 36, lineHeight: 44 }],
  "xl": [$baseStyle, { fontSize: 24, lineHeight: 34 }],
  "lg": [$baseStyle, { fontSize: 20, lineHeight: 24 }],
  "md": [$baseStyle, { fontSize: 18, lineHeight: 26 }],
  "sm": [$baseStyle, { fontSize: 16, lineHeight: 24 }],
  "xs": [$baseStyle, { fontSize: 14, lineHeight: 21 }],
  "xxs": [$baseStyle, { fontSize: 13, lineHeight: 19.5 }],
  "xxxs": [$baseStyle, { fontSize: 12, lineHeight: 18 }],
}

const $rtlStyle: TextStyle = isRTL ? { writingDirection: "rtl" } : {}
