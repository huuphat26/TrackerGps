import fs from "fs"
import path from "path"

const SVG_INDEX_FILE = path.resolve(__dirname, "../assets/svg/index.ts")
const SVG_COMPONENTS_DIR = path.resolve(__dirname, "../assets/svg")
const SVG_RAW_DIR = path.resolve(__dirname, "../assets/svg_raw")
const APP_DIR = path.resolve(__dirname, "../app")
const ASSETS_DIR = path.resolve(__dirname, "../assets")

function getAllIconNames(): Set<string> {
  const content = fs.readFileSync(SVG_INDEX_FILE, "utf8")
  const iconNames = new Set<string>()

  // Match keys in SvgType object
  const svgTypeRegex = /^\s+(\w+):\s+\w+,?\s*$/gm
  let match: RegExpExecArray | null

  while ((match = svgTypeRegex.exec(content)) !== null) {
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
        if (
          !entry.name.includes(".test.") &&
          !entry.name.includes(".spec.") &&
          !(entry.name === "index.ts" && dir.includes("svg"))
        ) {
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

function findUsedIcons(): Set<string> {
  const usedIcons = new Set<string>()
  const files = getAllSourceFiles([APP_DIR, ASSETS_DIR])

  const excludeKeywords = new Set([
    "ISvgType",
    "IconName",
    "IconTypes",
    "SvgIconProps",
    "ThemedStyle",
    "Parameters",
    "types",
    "type",
    "as",
    "const",
    "let",
    "var",
  ])

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, "utf8")

      // <SvgIcon icon="IconName" ... /> hoặc <SvgIcon name="IconName" ... />
      const svgIconPattern = /<SvgIcon[^>]*\s+(?:icon|name)\s*=\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      let match: RegExpExecArray | null
      while ((match = svgIconPattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // SvgIconProps={{ icon: "IconName" }}
      const svgIconPropsPattern = /SvgIconProps=\{\{\s*icon:\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = svgIconPropsPattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // leftIcon / rightIcon / icon props - string literal
      const iconPropsLiteralPattern = /(leftIcon|rightIcon|icon)\s*=\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = iconPropsLiteralPattern.exec(content)) !== null) {
        const iconName = match[2]
        if (!excludeKeywords.has(iconName) && /^[A-Z]/.test(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // leftIcon / rightIcon / icon props trong JSX expression, ví dụ:
      // rightIcon={condition ? "Editpost" : undefined}
      const iconPropsExprPattern =
        /(leftIcon|rightIcon|icon)\s*=\s*\{[^}]*?["']([A-Z][a-zA-Z0-9]*)["'][^}]*?\}/g
      while ((match = iconPropsExprPattern.exec(content)) !== null) {
        const iconName = match[2]
        if (!excludeKeywords.has(iconName) && /^[A-Z]/.test(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // icon: "IconName" in object literals
      const iconPropPascalPattern = /\bicon:\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = iconPropPascalPattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // import { News } from "@assets/svg"
      const importBlock = content.match(/import\s+\{([^}]+)\}\s+from\s+["']@assets\/svg["']/gi)
      if (importBlock) {
        for (const importLine of importBlock) {
          const namesMatch = importLine.match(/\{([^}]+)\}/i)
          if (namesMatch) {
            const names = namesMatch[1]
              .split(",")
              .map((n) =>
                n
                  .trim()
                  .split(/\s+as\s+/i)[0]
                  .trim(),
              )
              .filter(Boolean)
              .filter((name) => !excludeKeywords.has(name) && /^[A-Z]/.test(name))
            names.forEach((name) => usedIcons.add(name))
          }
        }
      }

      // import Default, { News } from "@assets/svg"
      const defaultImportPattern =
        /import\s+\w+(?:\s*,\s*\{([^}]+)\})?\s+from\s+["']@assets\/svg["']/gi
      let defaultMatch: RegExpExecArray | null
      while ((defaultMatch = defaultImportPattern.exec(content)) !== null) {
        if (defaultMatch[1]) {
          const names = defaultMatch[1]
            .split(",")
            .map((n) =>
              n
                .trim()
                .split(/\s+as\s+/i)[0]
                .trim(),
            )
            .filter(Boolean)
            .filter((name) => !excludeKeywords.has(name) && /^[A-Z]/.test(name))
          names.forEach((name) => usedIcons.add(name))
        }
      }

      // const icon: ISvgType = "News"
      const typePattern = /:\s*ISvgType\s*[=:]\s*["']([A-Z][a-zA-Z0-9]+)["']/g
      while ((match = typePattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read file ${file}:`, error)
    }
  }

  return usedIcons
}

function deleteFileIfExists(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log(`🗑️  Deleted: ${path.relative(process.cwd(), filePath)}`)
  }
}

function cleanSvgIndex(unusedIcons: string[]) {
  const content = fs.readFileSync(SVG_INDEX_FILE, "utf8")
  const lines = content.split(/\r?\n/)

  const unusedSet = new Set(unusedIcons)

  const filteredLines = lines.filter((line) => {
    // Remove import lines for unused icons
    if (line.startsWith("import ")) {
      for (const icon of unusedSet) {
        const importPattern = new RegExp(`\\b${icon}\\b`)
        if (importPattern.test(line)) {
          return false
        }
      }
      return true
    }

    // Remove SvgType entries for unused icons
    for (const icon of unusedSet) {
      const svgTypeEntryPattern = new RegExp(`^\\s*${icon}\\s*:`)
      if (svgTypeEntryPattern.test(line)) {
        return false
      }
    }

    return true
  })

  fs.writeFileSync(SVG_INDEX_FILE, filteredLines.join("\n"), "utf8")
}

function main() {
  console.log("🔍 Deleting unused SVG icons...\n")

  const allIcons = getAllIconNames()
  const usedIcons = findUsedIcons()

  const unusedIcons = Array.from(allIcons).filter((icon) => !usedIcons.has(icon))

  if (unusedIcons.length === 0) {
    console.log("✨ Great! No unused SVG icons to delete.")
    return
  }

  console.log(`⚠️  Found ${unusedIcons.length} unused icon(s). Deleting generated files:\n`)

  const sortedUnused = unusedIcons.sort()

  for (const iconName of sortedUnused) {
    const componentFile = path.join(SVG_COMPONENTS_DIR, `${iconName}.tsx`)
    const rawSvgFile = path.join(SVG_RAW_DIR, `${iconName}.svg`)

    deleteFileIfExists(componentFile)
    deleteFileIfExists(rawSvgFile)
  }

  cleanSvgIndex(sortedUnused)

  console.log("\n✅ Done deleting unused SVG icon files and cleaning assets/svg/index.ts.")
  console.log("ℹ️  You can re-run generate:svg if you add new raw icons later.")
}

main()
