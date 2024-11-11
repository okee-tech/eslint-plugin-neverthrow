import { ESLintUtils } from "@typescript-eslint/utils";

interface ExamplePluginDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

const createRule = ESLintUtils.RuleCreator<ExamplePluginDocs>(
  (name) =>
    `https://github.com/okee-tech/eslint-plugin-neverthrow/tree/main/docs/rules/${name}.md`
);

enum MessageIds {
  MUST_USE = "mustUseResult",
}

export { createRule, MessageIds, ExamplePluginDocs };
