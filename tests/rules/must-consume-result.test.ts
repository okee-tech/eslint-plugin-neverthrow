import ruleTester from "../index.js";
import rule from "../../src/rules/must-consume-result.js";
// import { MessageId } from "../../src/utils.js";

import { Result, ok } from "neverthrow";

const genOk: () => Result<string, string> = () => ok("test");
const okResult = genOk();
okResult.map((_el) => "").isOk();

const TMP = `

import { Result, ok, fromThrowable } from "neverthrow";

const genOk: () => Result<string, string> = () => ok("test");
const okResult = genOk();
okResult.isOk();

// const gen = fromThrowable(() => "test");
// const result = gen();
// gen();

// const genOk: () => Result<string, string> = () => ok("test");
// const okResult = genOk();
// genOk();

// const genThr = fromThrowable(() => "test");
// const thrResult = genThr();
// genThr();

// const a = okResult;
// const b = a;
// const d = b;

// b.isOk();

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
