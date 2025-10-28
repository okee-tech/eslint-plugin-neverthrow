import tsESLint from "typescript-eslint";
import plugin from "../plugin";
import { pluginName } from "../utils";
import type { TSESLint } from "@typescript-eslint/utils";

const config: TSESLint.FlatConfig.Config = {
  name: "neverthrow-recommended",
  plugins: { [pluginName]: plugin },
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
