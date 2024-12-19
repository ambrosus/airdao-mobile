import { ethers } from 'ethers';
import { environment } from '@utils/environment';
import { isNativeWrapped, wrapNativeAddress } from '../wrap-native-address';

const isTestnet = environment === 'testnet';

describe('wrapNativeAddress utility | Unit Test', () => {
  it('should wrap AMB to SAMB correctly', () => {
    const path = [
      ethers.constants.AddressZero,
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ];

    const expectedPath = [
      '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ];

    const excludeNativeETH = wrapNativeAddress(path);

    expect(excludeNativeETH).toStrictEqual(expectedPath);
  });

  it('should not wrap AMB to SAMB if the address is already wrapped', () => {
    const path = [
      '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ];

    const expectedPath = [
      '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ];

    const excludeNativeETH = wrapNativeAddress(path);

    expect(excludeNativeETH).toStrictEqual(expectedPath);
  });
});

describe('isNativeWrapped utility | Unit Test', () => {
  it('should return true when native address is wrapped', () => {
    const secondRoute = isTestnet
      ? '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b'
      : '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F';

    const path = [ethers.constants.AddressZero, secondRoute];

    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    expect(isSelectedSameTokens).toBeTruthy();
  });
});
