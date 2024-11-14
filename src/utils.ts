import { ESLintUtils } from "@typescript-eslint/utils";

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

export { createRule, MessageId, type PluginDocs };
