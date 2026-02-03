import fs from "fs"
import path from "path"

const ICONS_INDEX_FILE = path.resolve(__dirname, "../assets/icons/index.ts")
const APP_DIR = path.resolve(__dirname, "../app")
const ASSETS_DIR = path.resolve(__dirname, "../assets")

function getAllPngIconNames(): Set<string> {
  const content = fs.readFileSync(ICONS_INDEX_FILE, "utf8")
  const iconNames = new Set<string>()

  // Match object keys that point to require("./xxx.png") within iconRegistry
  // e.g.   back: require("./back.png"),
  const requireKeyRegex =
    /^\s*([a-zA-Z0-9_]+)\s*:\s*require\(\s*["'][.\/]([^)"']+)\.(?:png|webp)["']\s*\)\s*,?\s*$/gm
  let match
  while ((match = requireKeyRegex.exec(content)) !== null) {
    iconNames.add(match[1])
  }

  return iconNames
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

      // <Icon icon="back" /> or <PressableIcon icon="back" />
      const jsxIconPropPattern =
        /<\s*(Icon|PressableIcon)[^>]*\sicon\s*=\s*["']([a-z][a-zA-Z0-9_]*)["']/g
      let m
      while ((m = jsxIconPropPattern.exec(content)) !== null) {
        used.add(m[2])
      }

      // icon={condition ? "back" : undefined} on Icon/PressableIcon
      const jsxIconPropInExprPattern =
        /<\s*(Icon|PressableIcon)[^>]*\sicon\s*=\s*\{[^}]*?["']([a-z][a-zA-Z0-9_]*)["'][^}]*?\}/g
      while ((m = jsxIconPropInExprPattern.exec(content)) !== null) {
        used.add(m[2])
      }

      // Variables typed as IconTypes assigned a literal, e.g. const x: IconTypes = "back"
      const typedLiteralPattern = /:\s*IconTypes\s*[=:]\s*["']([a-z][a-zA-Z0-9_]*)["']/g
      while ((m = typedLiteralPattern.exec(content)) !== null) {
        used.add(m[1])
      }

      // Generic object literal property icon: "back" when it is lowercase (heuristic for raster icons)
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

function main() {
  console.log("🔍 Checking for unused raster (PNG/WEBP) icons...\n")

  const allIcons = getAllPngIconNames()
  const usedIcons = findUsedPngIcons()

  console.log(`📊 Total raster icons defined: ${allIcons.size}`)
  console.log(`✅ Raster icons used: ${usedIcons.size}`)

  const unused = Array.from(allIcons).filter((n) => !usedIcons.has(n))
  if (unused.length === 0) {
    console.log("\n✨ Great! All raster icons are being used.")
  } else {
    console.log(`\n⚠️  Found ${unused.length} unused raster icon(s):\n`)
    unused.sort().forEach((n) => console.log(`   - ${n}`))
  }

  const usedButMissing = Array.from(usedIcons).filter((n) => !allIcons.has(n))
  if (usedButMissing.length > 0) {
    console.log(
      `\n❌ Found ${usedButMissing.length} raster icon(s) used but not defined in iconRegistry:\n`,
    )
    usedButMissing.sort().forEach((n) => console.log(`   - ${n}`))
    console.log("\n⚠️  These might be typos or missing icon definitions in assets/icons/index.ts.")
  }

  console.log("\n" + "=".repeat(60))
  console.log("Note: This checker looks for lowercase icon names typical of raster icons.")
  console.log("PascalCase names are typically SVGs and are not counted here.")
  console.log("=".repeat(60))
}
main()
