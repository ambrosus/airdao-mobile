import { SwapStringUtils } from '../transformers';

describe('SwapStringUtils', () => {
  describe('transformAmountValue', () => {
    it('returns correct length of decimals', () => {
      const value = '29.95466565656';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('29.9546');
    });
  });
});
