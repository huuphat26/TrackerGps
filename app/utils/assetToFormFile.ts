// Minimal shape for the asset we need (avoid external type dependency)
export type Asset = {
  uri?: string | null
  mimeType?: string | null // ⬅️ thêm dòng này
  fileName?: string | null
  // (đừng dùng `type` để suy ra MIME khi đã sang expo-image-picker)
}

export type FormDataFile = { uri: string; name: string; type: string }

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "jpg",
  "image/heif": "jpg",
}

function inferMimeFromUri(uri?: string | null) {
  if (!uri) return undefined
  const ext = uri.split(".").pop()?.toLowerCase()
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
  if (ext === "png") return "image/png"
  if (ext === "webp") return "image/webp"
  if (ext === "heic" || ext === "heif") return "image/heic"
  return undefined
}

function pickMimeType(asset: Asset): string {
  const provided = asset.mimeType?.toLowerCase() || inferMimeFromUri(asset.uri)
  if (!provided) return "image/png"
  if (provided === "image/jpg") return "image/jpeg"
  return provided
}

function ensureExtension(filename: string, mime: string): string {
  const hasExt = /\.[A-Za-z0-9]+$/.test(filename)
  if (hasExt) return filename
  const ext = MIME_EXTENSION_MAP[mime] || "png"
  return `${filename}.${ext}`
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^A-Za-z0-9._-]+/g, "_")
}

export function assetToFormFile(asset: Asset): FormDataFile {
  if (!asset?.uri) throw new Error("Missing image uri")

  const mime = pickMimeType(asset)
  const fallbackExt = MIME_EXTENSION_MAP[mime] || "png"

  const rawName =
    asset.fileName && asset.fileName.trim().length ? asset.fileName.trim() : `avatar_${Date.now()}`

  const safeName = sanitizeFilename(ensureExtension(rawName, mime)).toLowerCase()
  const name = /\.[A-Za-z0-9]+$/.test(safeName) ? safeName : `${safeName}.${fallbackExt}`

  return { uri: asset.uri, name, type: mime }
}
