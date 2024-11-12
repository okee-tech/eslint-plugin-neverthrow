import type { TSESLint } from "@typescript-eslint/utils";
import mustUseResult from "./rules/must-consume-result";
import pkg from "../package.json";

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "must-consume-result": mustUseResult,
  },
  processors: {},
};

export = plugin;
