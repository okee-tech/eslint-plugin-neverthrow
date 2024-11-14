import tsESLint from "typescript-eslint";
import plugin from "../index";
import type { TSESLint } from "@typescript-eslint/utils";
import pkg from "../../package.json";

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
    [pluginName]: "error",
  },
};

export default config;
