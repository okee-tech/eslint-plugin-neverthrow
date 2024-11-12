import { ok, Result } from "neverthrow";

function genResult(): Result<string, string> {
  return ok("test");
}

genResult().unwrapOr("qwe");
genResult()
  .map((el) => el + "1")
  .isOk();
genResult().isOk();

const result1 = genResult();
result1._unsafeUnwrap();

const result2 = genResult();
const result2_1 = result2;
const reuslt2_2 = result2_1;
{
  // reuslt2_2._unsafeUnwrap();
}

function testFn1() {
  return genResult();
}

function testFn2() {
  const result1 = genResult();
  const result2 = result1;

  return result2;
}

const testArrowFn1 = () => genResult();
const testArrowFn2 = () => {
  const result1 = genResult();
  const result2 = result1;

  return result2;
};

const res1 = genResult();
const res2 = res1;
{
  const res3 = res2;
  {
    // eslint-disable-next-line prefer-const
    let res4 = res3;
    {
      // eslint-disable-next-line no-var
      var res5 = res4;
      {
        res5.isOk();
      }
    }
  }
}
