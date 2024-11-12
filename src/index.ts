import type { TSESLint } from "@typescript-eslint/utils";
import mustUseResult from "./rules/must-consume-result";
import pkg from "../package.json";
import tsESLint from "typescript-eslint";

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    "must-consume-result": mustUseResult,
  },
  processors: {},
  configs: {},
};

plugin.configs!.recommended = {
  name: "neverthrow-recommended",
  plugins: { [plugin.meta!.name!]: plugin },
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
    "@okee-tech/eslint-plugin-neverthrow/must-consume-result": "error",
  },
};

export = plugin;
