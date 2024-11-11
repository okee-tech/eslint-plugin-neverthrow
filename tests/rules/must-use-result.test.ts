import ruleTester from "..";
import rule from "../../src/rules/must-use-result";
import { MessageId } from "../../src/utils";

ruleTester.run("must-use-result", rule, {
  valid: [
    {
      code: `const x = 1 + 1;`,
    },
  ],
  invalid: [
    // {
    //   code: `1 + 1;`,
    //   errors: [{ messageId: MessageId.MUST_USE }],
    // },
  ],
});
