import { createRule, MessageId } from "../utils";
import { Result, ok, err, fromThrowable, Err } from "neverthrow";
import {
  ESLintUtils,
  type ParserServicesWithTypeInformation,
} from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/types";
import { NodeFlags, SyntaxKind, TypeChecker } from "typescript";
import path from "path";

const NEVERTHROW_PATH_INDENTIFIER = path.join("node_modules", "neverthrow");
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

  if (!sourceFile.fileName.includes(NEVERTHROW_PATH_INDENTIFIER)) return false;

  return true;
}

const rule = createRule<[], MessageId>({
  name: "must-use-result",
  meta: {
    type: "problem",
    docs: {
      description:
        "Not handling `neverthrow`'s `Result` is a possible error because errors could remain unhandled.",
      url: "",
    },
    schema: [],
    messages: {
      [MessageId.MUST_USE]: "test",
    },
  },
  create(context) {
    const resultVariables = new Map();
    const resultFunctions = new Set();

    const parserServices = fromThrowable(() =>
      ESLintUtils.getParserServices(context)
    )()
      .mapErr(
        (err) =>
          new Error(
            "Was not able to `getParserServices`, probably @typescript-eslint/parser is not used."
          )
      )
      ._unsafeUnwrap();

    const checker = parserServices.program.getTypeChecker();

    return {
      CallExpression(node) {
        if (isNeverthrowResult(node, parserServices)) return;
      },

      NewExpression(node) {},
    };
  },
  defaultOptions: [],
});

export = rule;
