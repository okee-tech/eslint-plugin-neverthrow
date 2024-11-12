import { createRule, MessageId } from "../utils";
import { fromThrowable, Err, Ok, ResultAsync } from "neverthrow";
import {
  ESLintUtils,
  type ParserServicesWithTypeInformation,
  type TSESLint,
} from "@typescript-eslint/utils";
import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/types";
import { SyntaxKind } from "typescript";
import path from "path";

function getConsumeMethods<T, A extends unknown[]>(
  class_: new (...args: A) => T
): string[] {
  return Reflect.ownKeys(class_?.prototype).filter(
    (el) =>
      el != "constructor" &&
      typeof el == "string" &&
      typeof class_?.prototype[el] == "function"
  ) as string[];
}

const NEVERTHROW_PATH_INDENTIFIER = path.join("node_modules", "neverthrow");
const RESULT_HANDLING_METHODS = new Set<string>([
  ...getConsumeMethods(Ok),
  ...getConsumeMethods(Err),
  ...getConsumeMethods(ResultAsync),
]);

function isNeverthrowResult(
  node: TSESTree.Node,
  parserServices: ParserServicesWithTypeInformation
): boolean {
  const type = parserServices.getTypeAtLocation(node);

  const symbol = type.aliasSymbol || type.symbol;
  if (!symbol) return false;
  if (symbol.name != "Result") return false;

  const declarations = symbol.declarations;
  if (!declarations) return false;

  const realDeclaration = declarations.find(
    (el) =>
      el.kind == SyntaxKind.TypeAliasDeclaration ||
      el.kind == SyntaxKind.ClassDeclaration
  );
  if (!realDeclaration) return false;

  const sourceFile = realDeclaration.getSourceFile();
  if (!sourceFile) return false;

  const sourcePath = path.normalize(sourceFile.fileName);
  if (!sourcePath.includes(NEVERTHROW_PATH_INDENTIFIER)) return false;

  return true;
}

function checkIfImediateResultFunction(node: TSESTree.Node): boolean {
  const consumeCallee = node.parent;
  if (!consumeCallee) return false;
  if (consumeCallee.type != AST_NODE_TYPES.MemberExpression) return false;
  if (consumeCallee.property.type != AST_NODE_TYPES.Identifier) return false;
  if (!RESULT_HANDLING_METHODS.has(consumeCallee.property.name)) return false;

  return true;
}

function checkIfImediateReturn(node: TSESTree.Node): boolean {
  const returnStatement = node.parent;
  if (!returnStatement) return false;

  if (returnStatement.type == AST_NODE_TYPES.ReturnStatement) return true;
  if (returnStatement.type == AST_NODE_TYPES.ArrowFunctionExpression)
    return true;
  if (returnStatement.type == AST_NODE_TYPES.YieldExpression) return true;

  return false;
}

function checkIfImediateResultConsumed(node: TSESTree.Node): boolean {
  return checkIfImediateResultFunction(node) || checkIfImediateReturn(node);
}

function checkIfVariableResultConsumed(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<MessageId, []>,
  visited: Set<TSESTree.Node> = new Set()
): boolean {
  if (visited.has(node)) return false;
  visited.add(node);

  const variable = node.parent;
  if (!variable) return false;
  if (variable.type != AST_NODE_TYPES.VariableDeclarator) return false;

  const variableId = variable.id;
  if (variableId.type != AST_NODE_TYPES.Identifier) return false;

  const originalScope = context.sourceCode.getScope(variable);
  const scopeIterator = (innerScope: typeof originalScope) => {
    const referenceNodes = innerScope?.references
      .filter((el) => el.identifier.name == variableId.name)
      .map((el) => el.identifier);

    if (referenceNodes.some((el) => checkIfImediateResultConsumed(el)))
      return true;

    return (
      innerScope.childScopes.some(scopeIterator) ||
      referenceNodes.some((el) =>
        checkIfVariableResultConsumed(el, context, visited)
      )
    );
  };

  return scopeIterator(originalScope);
}

function wasResultConsumed(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<MessageId, []>,
  _visited: Set<TSESTree.Node> = new Set()
): boolean {
  if (checkIfImediateResultConsumed(node)) return true;
  if (checkIfVariableResultConsumed(node, context)) return true;

  return false;
}

function checkNode(
  node: TSESTree.Node,
  context: TSESLint.RuleContext<MessageId, []>,
  parserServices: ParserServicesWithTypeInformation
) {
  if (!isNeverthrowResult(node, parserServices)) return;
  if (wasResultConsumed(node, context)) return;

  context.report({
    node,
    messageId: MessageId.MustConsume,
    suggest: [
      {
        messageId: MessageId.AddIsOk,
        fix: (fixer) => {
          return fixer.insertTextAfter(node, ".isOk()");
        },
      },
      {
        messageId: MessageId.AddUnsafeUnwrap,
        fix: (fixer) => {
          return fixer.insertTextAfter(node, "._unsafeUnwrap()");
        },
      },
    ],
  });
}

const rule = createRule<[], MessageId>({
  name: "must-consume-result",
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce proper handling of Result objects returned from neverthrow operations",
      recommended: true,
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [MessageId.MustConsume]:
        "`Result` is created but never consumed. Try to use `isOk` or `_unsafeUnwrap`.",
      [MessageId.AddIsOk]: "Add `isOk` to consume the `Result`.",
      [MessageId.AddUnsafeUnwrap]:
        "Add `_unsafeUnwrap` to consume the `Result`.",
    },
    hasSuggestions: true,
    fixable: "code",
  },
  create(context) {
    const parserServices = fromThrowable(() =>
      ESLintUtils.getParserServices(context)
    )()
      .mapErr(
        (_err) =>
          new Error(
            "Was not able to get typescript information, make sure `@typescript-eslint/parser` is properly configured."
          )
      )
      ._unsafeUnwrap();

    return {
      AwaitExpression(node: TSESTree.AwaitExpression) {
        checkNode(node, context, parserServices);
      },
      CallExpression(node: TSESTree.CallExpression) {
        checkNode(node, context, parserServices);
      },
    };
  },
  defaultOptions: [],
});

export = rule;
