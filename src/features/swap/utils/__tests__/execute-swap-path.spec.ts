import { executeSwapPath } from '../execute-swap-path';

describe('executeSwapPath utility | Unit Test', () => {
  it('Should return original array when isExactIn is true', () => {
    const isExactIn = true;

    const path = [
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ] as [string, string];

    const result = executeSwapPath(isExactIn, path);

    expect(result).toStrictEqual(path);
  });

  it('Should return reversed array when isExactIn is false', () => {
    const isExactIn = false;

    const path = [
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ] as [string, string];

    const result = executeSwapPath(isExactIn, path);

    expect(result).toStrictEqual(path.reverse());
  });
});
