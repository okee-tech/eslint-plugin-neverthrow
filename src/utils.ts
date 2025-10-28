import { ESLintUtils } from "@typescript-eslint/utils";
import pkg from "../package.json";
import type { Plugin } from "@eslint/core";

const pluginName = pkg.name;
if (!pluginName) throw new Error("Plugin name is required");

function asFlatPlugin(p: unknown): Plugin {
  return p as Plugin;
}

interface PluginDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

const createRule = ESLintUtils.RuleCreator<PluginDocs>(
  (name) =>
    `https://github.com/okee-tech/eslint-plugin-neverthrow/blob/master/docs/rules/${name}.md`
);

enum MessageId {
  MustConsume = "MustConsume",
  AddIsOk = "AddIsOk",
  AddUnsafeUnwrap = "AddUnsafeUnwrap",
}

export { createRule, MessageId, type PluginDocs, asFlatPlugin, pluginName };
