import { SwapStringUtils } from '../transformers';

describe('string transformers utility | Unit Test', () => {
  describe('transformAmountValue return correct length of decimals', () => {
    const value = '29.95466565656';
    const transformAmountValue = SwapStringUtils.transformAmountValue(value);
    expect(transformAmountValue).toEqual('29.9546');
  });
});
