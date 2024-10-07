import { ethers } from 'ethers';
import { getTokenNameFromDatabase } from '@utils/getTokenNameFromDatabase';

const NATIVE_TOKEN_NAME = 'AirDAO';

jest.mock('ethers', () => ({
  ethers: {
    constants: {
      AddressZero: '0x0000000000000000000000000000000000000000'
    }
  }
}));

describe('getTokenNameFromDatabase hook unit test', () => {
  it('should return the correct token name for a valid address', () => {
    const address = ethers.constants.AddressZero;

    const tokenName = getTokenNameFromDatabase(address);
    expect(tokenName).toBe(NATIVE_TOKEN_NAME);
  });

  it('should return "unknown" for an invalid address', () => {
    const address = 'invalid_address';

    const tokenName = getTokenNameFromDatabase(address);
    expect(tokenName).toBe('unknown');
  });
});
