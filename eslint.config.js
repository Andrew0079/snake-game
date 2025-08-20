import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist", "node_modules"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
      prettier, // disables stylistic rules in favor of Prettier
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // TypeScript strictness
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",

      // Unused vars, allow _prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // 🚀 Enforce clean import order at top of file
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js builtins (fs, path, etc.)
            "external", // npm packages (react, lodash, etc.)
            "internal", // alias paths like src/**
            ["parent", "sibling", "index"], // relative imports
            "object", // import foo = require("foo")
            "type", // TS types
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before", // always put React imports first
            },
            {
              pattern: "src/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      // Optional: no duplicate imports
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
    },
  },
]);
