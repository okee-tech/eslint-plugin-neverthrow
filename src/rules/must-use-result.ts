import { createRule, MessageIds } from "../utils";

const rule = createRule<[], MessageIds>({
  meta: {
    type: "problem",
    docs: {
      description:
        "Not handling neverthrow result is a possible error because errors could remain unhandleds.",
      url: "",
    },
    schema: [],
    messages: {
      [MessageIds.MUST_USE]: "test",
    },
  },
  name: "must-use-result",
  create(context) {
    return {};
  },
  defaultOptions: [],
});

export = rule;
