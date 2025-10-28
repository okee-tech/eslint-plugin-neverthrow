import tsESLint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import type { TSESLint } from "@typescript-eslint/utils";
import pkg from "../../package.json";
import plugin from "../plugin";

const pluginName = pkg.name;
if (!pluginName) throw new Error("Plugin name is required");

const nuxtConfig: TSESLint.FlatConfig.Config = {
  name: "neverthrow-nuxt",
  plugins: { [pluginName]: plugin },
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsESLint.parser,
      ecmaVersion: "latest",
      sourceType: "module",

      // 🧠 Key part — use ProjectService for type info in multi-config Nuxt setups
      projectService: {
        allowDefaultProject: ["*.ts", "*.vue"],
        defaultProject: "./tsconfig.json", // Nuxt root tsconfig with references
      },

      // Optional: root directory context
      tsconfigRootDir: process.cwd(),
      extraFileExtensions: [".vue"],
    },
  },
  rules: {
    [`${pluginName}/must-consume-result`]: "error",
  },
};

export default nuxtConfig;
