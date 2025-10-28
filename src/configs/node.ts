import tsESLint from "typescript-eslint";
import plugin from "../plugin";
import { type ConfigObject } from "@eslint/core";
import { pluginName, asFlatPlugin } from "../utils";

const config: ConfigObject = {
  name: "neverthrow-recommended",
  plugins: { [pluginName]: asFlatPlugin(plugin) },
  languageOptions: {
    parser: tsESLint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      projectService: {
        allowDefaultProject: ["*.ts"],
      },
    },
  },
  rules: {
    [`${pluginName}/must-consume-result`]: "error",
  },
};

export default config;
