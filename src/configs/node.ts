import tsESLint from "typescript-eslint";
import plugin from "../plugin";
import { asFlatPlugin, pluginName } from "../utils";
import type { Linter } from "eslint";

const config: Linter.Config = {
  name: "neverthrow-recommended",
  plugins: { [pluginName]: asFlatPlugin(plugin) },
  languageOptions: {
    parser: tsESLint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      projectService: {
        allowDefaultProject: ["*.ts", "*.mjs"],
        defaultProject: "./tsconfig.json",
      },
      tsconfigRootDir: process.cwd(),
    },
  },
  rules: {
    [`${pluginName}/must-consume-result`]: "error",
  },
};

export default config;
