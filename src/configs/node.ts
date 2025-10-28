import tsESLint from "typescript-eslint";
import plugin from "../plugin";
import { asFlatPlugin, pluginName } from "../utils";
import { type Config } from "@eslint/config-helpers";

const config: Config = {
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
