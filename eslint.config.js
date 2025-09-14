import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/scripts/ghostdown.js", // Third-party CodeMirror library
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Let Prettier handle formatting, only keep code quality rules
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  {
    files: ["src/scripts/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        // Project-specific globals
        rn_base_url: "readonly",
        // Third-party library globals
        Showdown: "readonly",
        CodeMirror: "readonly",
        Swal: "readonly",
        hljs: "readonly",
      },
    },
  },
];
