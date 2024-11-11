import type { TSESLint } from "@typescript-eslint/utils";
import pkg from "../package.json";
import mustUseResult from "./rules/must-use-result";

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "must-use-result": mustUseResult,
  },
  processors: {},
};

export = plugin;
