import tsESLint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import plugin from "../plugin";
import { type Config } from "@eslint/config-helpers";
import { asFlatPlugin, pluginName } from "../utils";

const nuxtConfig: Config = {
  name: "neverthrow-nuxt",
  plugins: { [pluginName]: asFlatPlugin(plugin) },
  languageOptions: {
    parser: vueParser,
    parserOptions: {
      parser: tsESLint.parser,
      ecmaVersion: "latest",
      sourceType: "module",

      projectService: {
        allowDefaultProject: ["*.ts", "*.vue"],
        defaultProject: "./tsconfig.json", // Nuxt root tsconfig with references
      },

      tsconfigRootDir: process.cwd(),
      extraFileExtensions: [".vue"],
    },
  },
  rules: {
    [`${pluginName}/must-consume-result`]: "error",
  },
};

export default nuxtConfig;
