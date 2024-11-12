import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

import neverThrowPlugin from "./dist/src/index.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["node_modules/**/*", "dist/**/*"],
    languageOptions: { globals: globals.node },
    ...pluginJs.configs.recommended,
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["tests/test-template.ts"],
    ...neverThrowPlugin.configs.recommended,
  },
];
