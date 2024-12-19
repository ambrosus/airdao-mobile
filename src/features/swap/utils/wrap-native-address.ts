import { ethers } from 'ethers';
import Config from '@constants/config';
import { SwapToken } from '@features/swap/types';
import { addresses } from './multi-route';

export function isNativeWrapped(path: string[]) {
  const wrappedPath = Config.SWAP_TOKENS.find(
    (token: SwapToken) => token.symbol === 'SAMB'
  )?.address;

  return path[0] === wrappedPath && path[1] === wrappedPath;
}

export function wrapNativeAddress(path: string[]): [string, string] {
  const nativeAddress = ethers.constants.AddressZero;

  const replacementAddress =
    Config.SWAP_TOKENS.find((token: SwapToken) => token.symbol === 'SAMB')
      ?.address ?? '';

  return path.map((token) =>
    token === nativeAddress ? replacementAddress : token
  ) as [string, string];
}

export function isETHtoWrapped(path: Array<string | undefined>) {
  return path[0] === ethers.constants.AddressZero && path[1] === addresses.SAMB;
}

export function isWrappedToETH(path: Array<string | undefined>) {
  return path[0] === addresses.SAMB && path[1] === ethers.constants.AddressZero;
}
