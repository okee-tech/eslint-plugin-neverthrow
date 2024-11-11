import { createRule, MessageId } from "../utils";

const rule = createRule<[], MessageId>({
  meta: {
    type: "problem",
    docs: {
      description:
        "Not handling neverthrow result is a possible error because errors could remain unhandleds.",
      url: "",
    },
    schema: [],
    messages: {
      [MessageId.MUST_USE]: "test",
    },
  },
  name: "must-use-result",
  create(context) {
    // context.report({})
    console.log(context);

    return {
      TSAnyKeyword(node) {
        return true;
      },
      ExpressionStatement(node) {
        return true;
      },
    };
  },
  defaultOptions: [],
});

export = rule;
