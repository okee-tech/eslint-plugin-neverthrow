import tsESLint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import pkg from "../../package.json";
import plugin from "../plugin";
import { ResolvableFlatConfig } from "eslint-flat-config-utils";
import type { Plugin } from "@eslint/core";

const pluginName = pkg.name;
if (!pluginName) throw new Error("Plugin name is required");

function asFlatPlugin(p: unknown): Plugin {
  return p as Plugin;
}

const nuxtConfig: ResolvableFlatConfig = {
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
