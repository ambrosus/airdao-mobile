import { StringValidators } from '@utils/validators';

describe('StringValidators', () => {
  describe('isStringAddress', () => {
    it('should return true for valid Ethereum addresses', () => {
      expect(
        StringValidators.isStringAddress(
          '0x32Be343B94f860124dC4fEe278FDCBD38C102D88'
        )
      ).toBe(true);
      expect(
        StringValidators.isStringAddress(
          '0x5B38Da6a701c568545dCfcB03FEa146bD2C9C1D9'
        )
      ).toBe(true);
    });

    it('should return false for invalid Ethereum addresses', () => {
      expect(StringValidators.isStringAddress('invalidAddress')).toBe(false);
      expect(StringValidators.isStringAddress('0x123')).toBe(false);
      expect(StringValidators.isStringAddress('')).toBe(false);
    });
  });
});
