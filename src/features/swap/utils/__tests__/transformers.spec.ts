import { SwapStringUtils } from '../transformers';

describe('SwapStringUtils', () => {
  describe('transformAmountValue', () => {
    it('returns correct length of decimals with length 2 of integer', () => {
      const value = '29.95466565656';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('29.9546');
    });

    it('returns correct length of decimals with length 3 of integer', () => {
      const value = '291.95466565656';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('291.954');
    });
    it('returns correct length of decimals with length 4 of integer', () => {
      const value = '2911.95466565656';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('2911.95');
    });
    it('returns correct length of decimals with length 5 of integer', () => {
      const value = '29111.95466565656';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('29111.9');
    });
    it('returns correct length of decimals with length 6 of integer', () => {
      const value = '291111.9546';
      const transformedValue = SwapStringUtils.transformAmountValue(value);

      expect(transformedValue).toEqual('291111.9');
    });
  });
});
