import tsESLint from "typescript-eslint";
import type { TSESLint } from "@typescript-eslint/utils";
import pkg from "../../package.json";
import plugin from "../plugin";

const pluginName = pkg.name;
if (!pluginName) throw new Error("Plugin name is required");

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
