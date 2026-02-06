import { load, save } from "@/utils/storage"

// v2: store only successful image loads with timestamps
const STORAGE_KEY = "imageValidityCache:v2"
const MAX_ENTRIES = 100
const TTL_MS = 3 * 24 * 60 * 60 * 1000 // 3 days

// We only persist successful loads; value is the timestamp when it was validated
const cache = new Map<string, number>()

function isExpired(timestampMs: number): boolean {
  return Date.now() - timestampMs > TTL_MS
}

function pruneToMaxEntries(): void {
  if (cache.size <= MAX_ENTRIES) return
  // Sort by timestamp ascending and delete oldest
  const sorted = Array.from(cache.entries()).sort((a, b) => a[1] - b[1])
  const toDelete = sorted.length - MAX_ENTRIES
  for (let i = 0; i < toDelete; i++) {
    cache.delete(sorted[i][0])
  }
}

function loadFromStorage() {
  const data = load<Record<string, number>>(STORAGE_KEY)
  if (data && typeof data === "object") {
    const now = Date.now()
    for (const [k, ts] of Object.entries(data)) {
      if (typeof ts === "number" && now - ts <= TTL_MS) {
        cache.set(k, ts)
      }
    }
    pruneToMaxEntries()
  }
}

function persistToStorage() {
  pruneToMaxEntries()
  const obj: Record<string, number> = {}
  for (const [k, ts] of cache.entries()) obj[k] = ts
  save(STORAGE_KEY, obj)
}

loadFromStorage()

export function getCachedValidity(uri: string | null | undefined): boolean | null {
  if (!uri) return null
  const ts = cache.get(uri)
  if (ts == null) return null
  if (isExpired(ts)) {
    cache.delete(uri)
    persistToStorage()
    return null
  }
  return true
}

export function setCachedValidity(uri: string | null | undefined, valid: boolean): void {
  if (!uri) return
  if (valid) {
    cache.set(uri, Date.now())
  } else {
    // Only store successes; failures should remove any existing success entry
    cache.delete(uri)
  }
  persistToStorage()
}
