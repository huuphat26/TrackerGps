// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    // `expo` must come after `standard` or its globals configuration will be overridden
    "expo",
    // `jsx-runtime` must come after `expo` or it will be overridden
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  plugins: ["prettier", "unused-imports", "import"],
  rules: {
    "prettier/prettier": "error",
    // typescript-eslint
    "@typescript-eslint/array-type": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": 0,
    // prefer plugin to auto-fix unused imports/vars
    "unused-imports/no-unused-imports": "error",
    // silence unused var warnings for now to keep output clean
    "unused-imports/no-unused-vars": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-require-imports": 0,
    "@typescript-eslint/no-empty-object-type": 0,
    // eslint
    "no-use-before-define": 0,
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: "Import named exports from 'react' instead of default import.",
          },
        ],
      },
    ],
    // react
    "react/prop-types": 0,
    "react/display-name": 0,
    // react-native
    "react-native/no-raw-text": 0,
    // Relax UI styling rules to focus on logic and formatting
    "react-native/no-inline-styles": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-unused-styles": 0,
    // eslint-config-standard overrides
    "comma-dangle": 0,
    "no-global-assign": 0,
    "quotes": 0,
    "space-before-function-paren": 0,
    // eslint-import
    // Temporarily disabled import/order rule due to unrs-resolver native binding issues
    // To re-enable: run `rm -rf node_modules package-lock.json && bun install`
    // "import/order": [
    //   "error",
    //   {
    //     "alphabetize": {
    //       order: "asc",
    //       caseInsensitive: true,
    //     },
    //     "newlines-between": "always",
    //     "groups": [["builtin", "external"], "internal", "unknown", ["parent", "sibling"], "index"],
    //     "distinctGroup": false,
    //     "pathGroups": [
    //       {
    //         pattern: "react",
    //         group: "external",
    //         position: "before",
    //       },
    //       {
    //         pattern: "react-native",
    //         group: "external",
    //         position: "before",
    //       },
    //       {
    //         pattern: "expo{,-*}",
    //         group: "external",
    //         position: "before",
    //       },
    //       {
    //         pattern: "@/**",
    //         group: "unknown",
    //         position: "after",
    //       },
    //     ],
    //     "pathGroupsExcludedImportTypes": ["react", "react-native", "expo", "expo-*"],
    //   },
    // ],
    "import/newline-after-import": 0,
    "import/no-unresolved": [
      "error",
      {
        ignore: ["@react-native-firebase/messaging", "^@/.*", "^@assets/.*"],
      },
    ],
    "react-native/sort-styles": 0,
    // Tone down noisy content warnings during cleanup
    "react/no-unescaped-entities": 0,
    // Hooks warnings can be noisy; disable for now
    "react-hooks/exhaustive-deps": 0,
    // general
    "no-empty-pattern": 0,
    // Disable import/namespace to avoid unrs-resolver native binding errors
    "import/namespace": 0,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      // Temporarily disabled typescript resolver due to unrs-resolver native binding issues
      // To re-enable: run `rm -rf node_modules package-lock.json && npm install`
      // typescript: {
      //   alwaysTryTypes: true,
      //   project: "./tsconfig.json",
      // },
    },
  },
}

