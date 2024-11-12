import ruleTester from "..";
import rule from "../../src/rules/must-use-result";
import { MessageId } from "../../src/utils";

const TMP = `

import { Result, ok, fromThrowable } from "neverthrow";

function returnResult(): Result<number, string> {
  return fromThrowable(() => {
        throw new Error("Not implemented")}
    )();
}

const result = returnResult();
returnResult();

`;

ruleTester.run("must-use-result", rule, {
  valid: [
    {
      code: TMP,
    },
  ],
  invalid: [
    // {
    //   code: `1 + 1;`,
    //   errors: [{ messageId: MessageId.MUST_USE }],
    // },
  ],
});
