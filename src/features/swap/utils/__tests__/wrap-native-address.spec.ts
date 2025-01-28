import { ethers } from 'ethers';
import { TOKEN_ADDRESSES } from '@features/swap/entities';
import { environment } from '@utils/environment';
import { isNativeWrapped, wrapNativeAddress } from '../wrap-native-address';

const addresses = TOKEN_ADDRESSES[environment];

describe('wrapNativeAddress utility | Unit Test', () => {
  it('should wrap AMB to SAMB correctly', () => {
    const path = [ethers.constants.AddressZero, addresses.BOND];

    const expectedPath = [addresses.SAMB, addresses.BOND];

    const excludeNativeETH = wrapNativeAddress(path);

    expect(excludeNativeETH).toStrictEqual(expectedPath);
  });

  it('should not wrap AMB to SAMB if the address is already wrapped', () => {
    const path = [addresses.SAMB, addresses.BOND];

    const expectedPath = [addresses.SAMB, addresses.BOND];

    const excludeNativeETH = wrapNativeAddress(path);

    expect(excludeNativeETH).toStrictEqual(expectedPath);
  });

  it('should return true when native address is wrapped', () => {
    const path = [ethers.constants.AddressZero, addresses.SAMB];

    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    expect(isSelectedSameTokens).toBeTruthy();
  });
});
