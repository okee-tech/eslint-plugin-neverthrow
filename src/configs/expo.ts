import tsESLint from "typescript-eslint";
import plugin from "../plugin";
import { asFlatPlugin, pluginName } from "../utils";
import { type Config } from "@eslint/config-helpers";

const expoConfig: Config = {
  name: "neverthrow-expo",
  plugins: { [pluginName]: asFlatPlugin(plugin) },
  languageOptions: {
    parser: tsESLint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
      projectService: {
        allowDefaultProject: ["*.ts", "*.tsx", "*.js", "*.jsx"],
        defaultProject: "./tsconfig.json",
      },
      tsconfigRootDir: process.cwd(),
    },
  },
  rules: {
    [`${pluginName}/must-consume-result`]: "error",
  },
};

export default expoConfig;
