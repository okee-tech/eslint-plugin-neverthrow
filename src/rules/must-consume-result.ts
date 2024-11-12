import { createRule, MessageId } from "../utils";
import { fromThrowable, Err, Ok, ResultAsync } from "neverthrow";
import {
  ESLintUtils,
  type ParserServicesWithTypeInformation,
} from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/types";
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
const _RESULT_HANDLING_METHODS = new Set<string>([
  ...getConsumeMethods(Ok),
  ...getConsumeMethods(Err),
  ...getConsumeMethods(ResultAsync),
]);

function isNeverthrowResult(
  node: TSESTree.Node,
  parserServices: ParserServicesWithTypeInformation
): boolean {
  const type = parserServices.getTypeAtLocation(node);

  const symbol = type.aliasSymbol;
  if (!symbol) return false;
  if (symbol.name != "Result") return false;

  const declarations = symbol.declarations;
  if (!declarations) return false;

  const realDeclaration = declarations.find(
    (el) => el.kind == SyntaxKind.TypeAliasDeclaration
  );
  if (!realDeclaration) return false;

  const sourceFile = realDeclaration.getSourceFile();
  if (!sourceFile) return false;

  const sourcePath = path.normalize(sourceFile.fileName);
  if (!sourcePath.includes(NEVERTHROW_PATH_INDENTIFIER)) return false;

  return true;
}

function wasResultConsumed(
  node: TSESTree.Node,
  parserServices: ParserServicesWithTypeInformation
): boolean {
  const _type = parserServices.getTypeAtLocation(node);

  return true;
}

const rule = createRule<[], MessageId>({
  name: "must-use-result",
  meta: {
    type: "problem",
    docs: {
      recommended: true,
      requiresTypeChecking: true,
      description:
        "Not consuming `neverthrow`'s `Result` is a possible error because errors could remain unhandled.",
    },
    schema: [],
    messages: {
      [MessageId.MUST_USE]: "test",
    },
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
      CallExpression(node: TSESTree.CallExpression) {
        if (!isNeverthrowResult(node, parserServices)) return;
        if (wasResultConsumed(node, parserServices)) return;

        context.report({
          node,
          messageId: MessageId.MUST_USE,
        });
      },
    };
  },
  defaultOptions: [],
});

export = rule;
