import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    ignores: ["src/generated", "node_modules", "dist"],
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": 0,
      "@typescript-eslint/no-explicit-any": 0,
    },
  },
])
