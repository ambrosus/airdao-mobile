import { ethers } from 'ethers';
import { getTokenNameFromDatabase } from '@utils/getTokenNameFromDatabase';

const NATIVE_TOKEN_NAME = 'AirDAO';

describe('getTokenNameFromDatabase hook unit test', () => {
  it('should return the correct token name for a valid address', () => {
    const tokenName = getTokenNameFromDatabase(ethers.constants.AddressZero);
    expect(tokenName).toBe(NATIVE_TOKEN_NAME);
  });

  it('should return "unknown" for an invalid address', () => {
    const tokenName = getTokenNameFromDatabase('invalid_address');
    expect(tokenName).toBe('unknown');
  });
});
