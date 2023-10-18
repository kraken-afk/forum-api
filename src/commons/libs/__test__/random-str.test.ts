import { expect, test } from 'vitest';
import { randomStr } from '~/commons/libs/random-str';

test('Random string generator test case', () => {
  const len = 60;
  const randStr = randomStr(60);

  expect(randStr).toBeTypeOf('string');
  expect(randStr.length).toStrictEqual(len);
  expect(randomStr()).not.toEqual(randomStr());
  expect(() => randomStr(-1)).toThrowError('cannot be negative number');

  console.info(randStr);
});
