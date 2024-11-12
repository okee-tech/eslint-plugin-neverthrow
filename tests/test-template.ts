import { ok, Result, ResultAsync, safeTry } from "neverthrow";

const genResult = Result.fromThrowable(() => ok("test"));
const genResultAsync = ResultAsync.fromThrowable(async () => ok("test"));

const result1 = genResult();
result1._unsafeUnwrap();

(async () => {
  const res = await genResultAsync();
  res.isOk();

  (await genResultAsync().map((el) => el + "1")).isOk();
})();

const result2 = genResult();
const result2_1 = result2;
const reuslt2_2 = result2_1;
{
  reuslt2_2._unsafeUnwrap();
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

genResult().isOk();

(async () => {
  await genResultAsync();
})();

(async () => {
  const result = await genResultAsync();
  result.isOk();
})();

(async () => {
  const result = genResultAsync();
  (await result).isOk();
})();
