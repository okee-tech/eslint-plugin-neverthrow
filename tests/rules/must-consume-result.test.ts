import ruleTester from "../index";
import rule from "../../src/rules/must-consume-result";
import { MessageId } from "../../src/utils";

const HELPERS_IJECT = (code: string) => `
import { Result, ResultAsync, ok, err } from "neverthrow";

const genResult = Result.fromThrowable(() => ok("test"));
const genResultAsync = ResultAsync.fromThrowable(async () => ok("test"));

${code}
`;

const ERROR_HELPER = (code: string) => {
  const fullTestCode = HELPERS_IJECT(code);
  return {
    code: fullTestCode,
    errors: [
      {
        messageId: MessageId.MustConsume,
        suggestions: [
          {
            messageId: MessageId.AddIsOk,
            output: fullTestCode
              .replaceAll("genResult()", "genResult().isOk()")
              .replaceAll("genResultAsync()", "genResultAsync().isOk()"),
          },
          {
            messageId: MessageId.AddUnsafeUnwrap,
            output: fullTestCode
              .replaceAll("genResult()", "genResult()._unsafeUnwrap()")
              .replaceAll(
                "genResultAsync()",
                "genResultAsync()._unsafeUnwrap()"
              ),
          },
        ],
      },
    ],
  };
};

ruleTester.run("must-consume-result", rule, {
  valid: [
    {
      code: HELPERS_IJECT(`
        genResult().isOk();
      `),
    },
    {
      code: HELPERS_IJECT(`
        const result1 = genResult();
        result1._unsafeUnwrap();
      `),
    },
    {
      code: HELPERS_IJECT(`
        function testFn1() {
          const externalCall = genResult();
          return externalCall;
        }
      `),
    },
    {
      code: HELPERS_IJECT(`
        function testFn2() {
          const result1 = genResult();
          const result2 = result1;
          return result2;
        }
      `),
    },
    {
      code: HELPERS_IJECT(`
        const testArrowFn1 = () => genResult();
      `),
    },
    {
      code: HELPERS_IJECT(`
        const testArrowFn2 = () => {
          const result1 = genResult();
          const result2 = result1;
          return result2;
        }
      `),
    },
    {
      code: HELPERS_IJECT(`
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
      `),
    },
    {
      code: HELPERS_IJECT(`
        function myFunc(): Result<string, string> {
          return safeTry<string, string>(function* () {
            return ok(
              (yield* genResult().mapErr(
                (e) => "aborted by an error from 1st function, " + e
              )) + (yield* genResult())
            );
          });
        }
      `),
    },
    {
      code: HELPERS_IJECT(`
        (async () => {
          (await genResultAsync()).isOk();
        })();
      `),
    },
    {
      code: HELPERS_IJECT(`
        (async () => {
          const result = await genResultAsync();
          result.isOk();
        })();
      `),
    },
    {
      code: HELPERS_IJECT(`
        (async () => {
          const result = genResultAsync();
          (await result).isOk();
        })();
      `),
    },
  ],
  invalid: [
    ERROR_HELPER(`
      genResult();
    `),
    ERROR_HELPER(`
      const result1 = genResult();
    `),
    ERROR_HELPER(`
      const result1 = genResult();
      const result2 = result1;
    `),
    ERROR_HELPER(`
      const res1 = genResult();
      const res2 = res1;
      {
        const res3 = res2;
        {
          let res4 = res3;
          {
            var res5 = res4;
          }
        }
      }
    `),
    ERROR_HELPER(`
      (async () => {
        await genResultAsync();
      })();
    `),
    ERROR_HELPER(`
      (async () => {
        const result = await genResultAsync();
      })();
    `),
  ],
});
