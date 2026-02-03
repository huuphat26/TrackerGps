/**
 * Brand & Action Colors
 * Màu sắc chủ đạo cho nút nhấn, biểu tượng quan trọng và trạng thái hoạt động
 */
const brandColors = {
  primary: "#007AFF",      // Xanh iOS - tin cậy, công nghệ
  secondary: "#F2F2F7",    // Xám nhạt - nút phụ, nền icon
  success: "#34C759",      // Trạng thái Online/Thành công
  warning: "#FFCC00",      // Trạng thái Pending/Chờ
  danger: "#FF3B30",       // Trạng thái Offline/Lỗi/Logout
} as const

/**
 * Light Mode Colors
 * Dành cho Devices List, Gallery, Account
 */
const lightMode = {
  background: "#FFFFFF",   // Trắng tuyệt đối
  surface: "#F9F9F9",      // Xám nhạt - Card/List
  textPrimary: "#000000",  // Đen - Tiêu đề, văn bản chính
  textSecondary: "#8E8E93", // Xám - Metadata, mô tả phụ
  border: "#E5E5EA",       // Đường kẻ phân cách
} as const

/**
 * Dark Mode Colors
 * Dành cho MapHome, CaptureViewer, trạng thái Connecting
 */
const darkMode = {
  background: "#1C1C1E",   // Đen xám sâu - tương phản với bản đồ
  surface: "#2C2C2E",      // Bottom Sheet và Modals
  textPrimary: "#FFFFFF",  // Trắng - Đọc tốt trên nền tối
  textSecondary: "#AEAEB2", // Xám sáng - Thông tin phụ
  overlay: "rgba(0, 0, 0, 0.6)", // Lớp phủ làm mờ nền Modal
} as const

/**
 * Map Style Colors
 * Màu sắc cho bản đồ
 */
const mapColors = {
  water: "#A3CCFF",        // Xanh nhạt
  roads: "#FFFFFF",        // Trắng
  land: "#F2F2F2",         // Xám nhạt - bản đồ sáng
  darkLand: "#242426",     // Bản đồ tối
} as const

/**
 * Extended palette - includes both legacy and new iOS-style colors
 * Dark theme inverts the neutral colors
 */
const palette = {
  // Legacy neutral colors (inverted for dark mode)
  neutral900: "#FFFFFF",
  neutral800: "#F4F2F1",
  neutral700: "#D7CEC9",
  neutral600: "#B6ACA6",
  neutral500: "#978F8A",
  neutral400: "#564E4A",
  neutral300: "#3C3836",
  neutral200: "#191015",
  neutral100: "#000000",

  // Legacy primary colors (inverted for dark mode)
  primary600: "#F4E0D9",
  primary500: "#E8C1B4",
  primary400: "#DDA28E",
  primary300: "#D28468",
  primary200: "#C76542",
  primary100: "#A54F31",

  // Legacy secondary colors (inverted for dark mode)
  secondary500: "#DCDDE9",
  secondary400: "#BCC0D6",
  secondary300: "#9196B9",
  secondary200: "#626894",
  secondary100: "#41476E",

  // Legacy accent colors (inverted for dark mode)
  accent500: "#FFEED4",
  accent400: "#FFE1B2",
  accent300: "#FDD495",
  accent200: "#FBC878",
  accent100: "#FFBB50",

  // Legacy angry colors
  angry100: "#F2D6CD",
  angry500: "#C03403",

  // Legacy overlays
  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  // ========================================
  // NEW iOS-Style Colors
  // ========================================

  // Brand & Action Colors
  iosPrimary: "#007AFF",      // Xanh iOS - tin cậy, công nghệ
  iosSecondary: "#F2F2F7",    // Xám nhạt - nút phụ, nền icon
  iosSuccess: "#34C759",      // Trạng thái Online/Thành công
  iosWarning: "#FFCC00",      // Trạng thái Pending/Chờ
  iosDanger: "#FF3B30",       // Trạng thái Offline/Lỗi/Logout

  // Light Mode Colors
  lightBackground: "#FFFFFF",   // Trắng tuyệt đối
  lightSurface: "#F9F9F9",      // Xám nhạt - Card/List
  lightTextPrimary: "#000000",  // Đen - Tiêu đề, văn bản chính
  lightTextSecondary: "#8E8E93", // Xám - Metadata, mô tả phụ
  lightBorder: "#E5E5EA",       // Đường kẻ phân cách

  // Dark Mode Colors
  darkBackground: "#1C1C1E",   // Đen xám sâu - tương phản với bản đồ
  darkSurface: "#2C2C2E",      // Bottom Sheet và Modals
  darkTextPrimary: "#FFFFFF",  // Trắng - Đọc tốt trên nền tối
  darkTextSecondary: "#AEAEB2", // Xám sáng - Thông tin phụ
  darkOverlay: "rgba(0, 0, 0, 0.6)", // Lớp phủ làm mờ nền Modal

  // Map Style Colors
  mapWater: "#A3CCFF",        // Xanh nhạt
  mapRoads: "#FFFFFF",        // Trắng
  mapLand: "#F2F2F2",         // Xám nhạt - bản đồ sáng
  mapDarkLand: "#242426",     // Bản đồ tối
} as const

export const colors = {
  /**
   * Brand & Action Colors
   */
  brand: brandColors,

  /**
   * Light Mode Colors
   */
  light: lightMode,

  /**
   * Dark Mode Colors
   */
  dark: darkMode,

  /**
   * Map Colors
   */
  map: mapColors,

  /**
   * Legacy palette - available for backward compatibility
   */
  palette,

  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",

  /**
   * The default text color in many components.
   */
  text: palette.neutral800,

  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,

  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,

  /**
   * The default border color.
   */
  border: palette.neutral400,

  /**
   * The main tinting color.
   */
  tint: palette.primary500,

  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,

  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,

  /**
   * Error messages.
   */
  error: palette.angry500,

  /**
   * Error Background.
   */
  errorBackground: palette.angry100,

  /**
   * Primary color - maps to brand primary for convenience
   */
  primary: brandColors.primary,

  /**
   * White color - commonly used
   */
  white: "#FFFFFF",
} as const
