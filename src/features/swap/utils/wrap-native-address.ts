import Config from '@constants/config';
import { SwapToken } from '../types';
import { addresses } from './multi-route';
import { ethers } from 'ethers';

export function isNativeWrapped(path: string[]) {
  const wrappedPath = Config.SWAP_TOKENS.find(
    (token: SwapToken) => token.symbol === 'SAMB'
  )?.address;

  const isPathSameAddress = path[0] === wrappedPath && path[1] === wrappedPath;

  return isPathSameAddress;
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
