import { isNativeWrapped, wrapNativeAddress } from '../wrap-native-address';

describe('wrapNativeAddress utility | Unit Test', () => {
  it('should wrap AMB to SAMB correctly', () => {
    const path = [
      '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ] as [string, string];

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
    ] as [string, string];

    const expectedPath = [
      '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b',
      '0x765e3e03f8dfca312efdab378e386e1ea60ee93f'
    ];

    const excludeNativeETH = wrapNativeAddress(path);

    expect(excludeNativeETH).not.toStrictEqual(expectedPath);
  });
});

describe('isNativeWrapped utility | Unit Test', () => {
  it('should return true when native address is wrapped', () => {
    const path = [
      '0xd78AB887A33EaC829B0DDE8714f79276E1255028',
      '0x2Cf845b49e1c4E5D657fbBF36E97B7B5B7B7b74b'
    ] as [string, string];

    const excludeNativeETH = wrapNativeAddress(path);
    const isSelectedSameTokens = isNativeWrapped(excludeNativeETH);

    expect(isSelectedSameTokens).toBeTruthy();
  });
});
