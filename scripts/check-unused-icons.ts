import fs from "fs"
import path from "path"

const SVG_INDEX_FILE = path.resolve(__dirname, "../assets/svg/index.ts")
const APP_DIR = path.resolve(__dirname, "../app")
const ASSETS_DIR = path.resolve(__dirname, "../assets")

/**
 * Đọc và extract tất cả icon names từ assets/svg/index.ts
 */
function getAllIconNames(): Set<string> {
  const content = fs.readFileSync(SVG_INDEX_FILE, "utf8")
  const iconNames = new Set<string>()

  // Tìm tất cả keys trong SvgType object
  // Format: IconName: IconName,
  const svgTypeRegex = /^\s+(\w+):\s+\w+,?\s*$/gm
  let match

  while ((match = svgTypeRegex.exec(content)) !== null) {
    iconNames.add(match[1])
  }

  return iconNames
}

/**
 * Scan codebase để tìm các icon được sử dụng
 */
function findUsedIcons(): Set<string> {
  const usedIcons = new Set<string>()

  // 1. Tìm tất cả các file .tsx, .ts trong app/ và assets/
  const files = getAllSourceFiles([APP_DIR, ASSETS_DIR])

  // Danh sách các từ khóa không phải icon names (type names, etc.)
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

      // Pattern 1: <SvgIcon icon="IconName" hoặc name="IconName"
      // Cho phép cả single character (như "X") và multi-character
      // Pattern này sẽ match: <SvgIcon icon="X", <SvgIcon name="News", etc.
      const svgIconPattern = /<SvgIcon[^>]*\s+(?:icon|name)\s*=\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      let match
      while ((match = svgIconPattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // Pattern 2: SvgIconProps={{ icon: "IconName" }}
      const svgIconPropsPattern = /SvgIconProps=\{\{\s*icon:\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = svgIconPropsPattern.exec(content)) !== null) {
        const iconName = match[1]
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // Pattern 3: leftIcon, rightIcon props (dùng trong Button, TextField, ListItem, Header, etc.)
      // Ví dụ: leftIcon="Plus", rightIcon="Search"
      const iconPropsLiteralPattern = /(leftIcon|rightIcon|icon)\s*=\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = iconPropsLiteralPattern.exec(content)) !== null) {
        const iconName = match[2]
        if (!excludeKeywords.has(iconName) && /^[A-Z]/.test(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // Pattern 3b: leftIcon, rightIcon, icon trong JSX expression
      // Ví dụ: rightIcon={condition ? "Editpost" : undefined}
      const iconPropsExprPattern =
        /(leftIcon|rightIcon|icon)\s*=\s*\{[^}]*?["']([A-Z][a-zA-Z0-9]*)["'][^}]*?\}/g
      while ((match = iconPropsExprPattern.exec(content)) !== null) {
        const iconName = match[2]
        if (!excludeKeywords.has(iconName) && /^[A-Z]/.test(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // Pattern 4: icon: "IconName" trong object literals (chỉ khi là PascalCase - icon name)
      // Pattern này có thể match nhiều context, nhưng chỉ khi là PascalCase
      const iconPropPascalPattern = /\bicon:\s*["']([A-Z][a-zA-Z0-9]*)["']/g
      while ((match = iconPropPascalPattern.exec(content)) !== null) {
        const iconName = match[1]
        // Skip nếu là trong context không phải icon component
        // (ví dụ: trong FEATURES constants có thể là feature identifiers, không phải icon)
        // Nhưng nếu là PascalCase và không phải keyword, thì có khả năng là icon name
        if (!excludeKeywords.has(iconName)) {
          usedIcons.add(iconName)
        }
      }

      // Pattern 5: Import trực tiếp từ @assets/svg (ví dụ: import { News } from "@assets/svg")
      const importBlock = content.match(/import\s+\{([^}]+)\}\s+from\s+["']@assets\/svg["']/gi)
      if (importBlock) {
        for (const importLine of importBlock) {
          const namesMatch = importLine.match(/\{([^}]+)\}/i)
          if (namesMatch) {
            const names = namesMatch[1]
              .split(",")
              .map((n) => {
                // Extract name before 'as' if present
                const name = n
                  .trim()
                  .split(/\s+as\s+/i)[0]
                  .trim()
                return name
              })
              .filter(Boolean)
              .filter((name) => !excludeKeywords.has(name) && /^[A-Z]/.test(name))
            names.forEach((name) => usedIcons.add(name))
          }
        }
      }

      // Pattern 6: Import default và destructure named imports
      const defaultImportPattern =
        /import\s+\w+(?:\s*,\s*\{([^}]+)\})?\s+from\s+["']@assets\/svg["']/gi
      let defaultMatch
      while ((defaultMatch = defaultImportPattern.exec(content)) !== null) {
        if (defaultMatch[1]) {
          const names = defaultMatch[1]
            .split(",")
            .map((n) => {
              const name = n
                .trim()
                .split(/\s+as\s+/i)[0]
                .trim()
              return name
            })
            .filter(Boolean)
            .filter((name) => !excludeKeywords.has(name) && /^[A-Z]/.test(name))
          names.forEach((name) => usedIcons.add(name))
        }
      }

      // Pattern 7: Tìm các biến có type ISvgType và được gán string literal
      // Ví dụ: const icon: ISvgType = "News"
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

/**
 * Recursively lấy tất cả các file .ts, .tsx từ directories
 */
function getAllSourceFiles(directories: string[]): string[] {
  const files: string[] = []

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return

    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      // Skip node_modules, build folders, etc.
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
        // Skip test files và index.ts của svg
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

/**
 * Main function
 */
function main() {
  console.log("🔍 Checking for unused SVG icons...\n")

  const allIcons = getAllIconNames()
  const usedIcons = findUsedIcons()

  console.log(`📊 Total icons defined: ${allIcons.size}`)
  console.log(`✅ Icons used: ${usedIcons.size}`)

  // Tìm các icon không được sử dụng
  const unusedIcons = Array.from(allIcons).filter((icon) => !usedIcons.has(icon))

  if (unusedIcons.length === 0) {
    console.log("\n✨ Great! All icons are being used.")
  } else {
    console.log(`\n⚠️  Found ${unusedIcons.length} unused icon(s):\n`)
    unusedIcons.sort().forEach((icon) => {
      console.log(`   - ${icon}`)
    })
    console.log("\n💡 Tip: You can safely remove these icons if they're not needed.")
  }

  // Tìm các icon được dùng nhưng không tồn tại (có thể là typo)
  const usedButNotFound = Array.from(usedIcons).filter((icon) => !allIcons.has(icon))
  if (usedButNotFound.length > 0) {
    console.log(`\n❌ Found ${usedButNotFound.length} icon(s) used but not defined in SvgType:\n`)
    usedButNotFound.sort().forEach((icon) => {
      console.log(`   - ${icon}`)
    })
    console.log("\n⚠️  These might be typos or missing icon definitions.")
  }

  console.log("\n" + "=".repeat(60))
  console.log("Note: Icons are matched by PascalCase names only.")
  console.log("Lowercase icon identifiers (like 'markets', 'news') are")
  console.log("not tracked as they may be feature identifiers, not icon names.")
  console.log("=".repeat(60))
}

// Chạy script
main()
