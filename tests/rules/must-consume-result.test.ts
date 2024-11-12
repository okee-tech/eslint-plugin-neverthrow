import ruleTester from "../index";
import rule from "../../src/rules/must-consume-result";
// import { MessageId } from "../../src/utils.js";

import { Result, ok } from "neverthrow";

const genOk: () => Result<string, string> = () => ok("test");
const okResult = genOk();
okResult.map((_el) => "").isOk();

const TMP = `

import { ok, Result } from "neverthrow";

function genResult(): Result<string, string> {
  return ok("test");
}

const res1 = genResult();
const res2 = res1;
{
  const res3 = res2;
  {
    let res4 = res3;
    {
      var res5 = res4;
      {
        res5.isOk();
      }
    }
  }
}

`;

ruleTester.run("must-consume-result", rule, {
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
