import fs from "fs"
import path from "path"

const ICONS_INDEX_FILE = path.resolve(__dirname, "../assets/icons/index.ts")
const ICONS_DIR = path.resolve(__dirname, "../assets/icons")
const APP_DIR = path.resolve(__dirname, "../app")
const ASSETS_DIR = path.resolve(__dirname, "../assets")

function getAllPngIconNames(): { allNames: Set<string>; keyToBase: Map<string, string> } {
  const content = fs.readFileSync(ICONS_INDEX_FILE, "utf8")
  const iconNames = new Set<string>()
  const keyToBase = new Map<string, string>()

  const requireKeyRegex =
    /^\s*([a-zA-Z0-9_]+)\s*:\s*require\(\s*["'][.\/]([^)"']+)\.(?:png|webp)["']\s*\)\s*,?\s*$/gm
  let match: RegExpExecArray | null
  while ((match = requireKeyRegex.exec(content)) !== null) {
    const key = match[1]
    const base = match[2]
    iconNames.add(key)
    keyToBase.set(key, base)
  }

  return { allNames: iconNames, keyToBase }
}

function getAllSourceFiles(directories: string[]): string[] {
  const files: string[] = []

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (
        entry.name.startsWith(".") ||
        entry.name === "node_modules" ||
        entry.name === "build" ||
        entry.name === ".git"
      ) {
        continue
      }

      if (entry.isDirectory()) {
        walkDir(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
        if (!entry.name.includes(".test.") && !entry.name.includes(".spec.")) {
          files.push(fullPath)
        }
      }
    }
  }

  for (const dir of directories) {
    walkDir(dir)
  }
  return files
}

function findUsedPngIcons(): Set<string> {
  const used = new Set<string>()
  const files = getAllSourceFiles([APP_DIR, ASSETS_DIR])

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8")

      const jsxIconPropPattern =
        /<\s*(Icon|PressableIcon)[^>]*\sicon\s*=\s*["']([a-z][a-zA-Z0-9_]*)["']/g
      let m: RegExpExecArray | null
      while ((m = jsxIconPropPattern.exec(content)) !== null) {
        used.add(m[2])
      }

      const jsxIconPropInExprPattern =
        /<\s*(Icon|PressableIcon)[^>]*\sicon\s*=\s*\{[^}]*?["']([a-z][a-zA-Z0-9_]*)["'][^}]*?\}/g
      while ((m = jsxIconPropInExprPattern.exec(content)) !== null) {
        used.add(m[2])
      }

      const typedLiteralPattern = /:\s*IconTypes\s*[=:]\s*["']([a-z][a-zA-Z0-9_]*)["']/g
      while ((m = typedLiteralPattern.exec(content)) !== null) {
        used.add(m[1])
      }

      const plainIconPropLowerPattern = /\bicon\s*:\s*["']([a-z][a-zA-Z0-9_]*)["']/g
      while ((m = plainIconPropLowerPattern.exec(content)) !== null) {
        used.add(m[1])
      }
    } catch (err) {
      console.warn(`⚠️  Could not read file ${file}:`, err)
    }
  }

  return used
}

function deleteFileIfExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`🗑️  Deleted: ${path.relative(process.cwd(), filePath)}`)
  }
}

function removeIconsFromIndex(unusedKeys: Set<string>) {
  const content = fs.readFileSync(ICONS_INDEX_FILE, "utf8")
  const lines = content.split(/\r?\n/)

  const filteredLines = lines.filter((line) => {
    for (const key of unusedKeys) {
      const keyPattern = new RegExp(`^\\s*${key}\\s*:`)
      if (keyPattern.test(line)) {
        return false
      }
    }
    return true
  })

  fs.writeFileSync(ICONS_INDEX_FILE, filteredLines.join("\n"), "utf8")
}

function main() {
  console.log("🔍 Deleting unused raster (PNG/WEBP) icons...\n")

  const { allNames, keyToBase } = getAllPngIconNames()
  const usedIcons = findUsedPngIcons()

  const unused = new Set(Array.from(allNames).filter((n) => !usedIcons.has(n)))

  if (unused.size === 0) {
    console.log("✨ Great! No unused raster icons to delete.")
    return
  }

  console.log(
    `⚠️  Found ${unused.size} unused raster icon(s). Deleting files and registry entries:\n`,
  )

  for (const key of Array.from(unused).sort()) {
    const base = keyToBase.get(key)
    if (!base) continue

    for (const ext of ["png", "webp"]) {
      for (const suffix of ["", "@2x", "@3x"]) {
        const filePath = path.join(ICONS_DIR, `${base}${suffix}.${ext}`)
        deleteFileIfExists(filePath)
      }
    }
  }

  removeIconsFromIndex(unused)

  console.log("\n✅ Done deleting unused raster icon files and cleaning iconRegistry.")
}

main()
