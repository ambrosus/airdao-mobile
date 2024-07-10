import Config from '@constants/config';
import { SWAP_SUPPORTED_TOKENS } from '@features/swap/entities';
import { environment } from '@utils/environment';
import { SwapToken } from '../types';
import { addresses } from './multi-route';

export function isNativeWrapped(path: string[]) {
  const wrappedPath = Config.SWAP_TOKENS.find(
    (token: SwapToken) => token.symbol === 'SAMB'
  )?.address;

  const isPathSameAddress = path[0] === wrappedPath && path[1] === wrappedPath;

  return isPathSameAddress;
}

export function wrapNativeAddress(path: string[]): [string, string] {
  const nativeAddress = SWAP_SUPPORTED_TOKENS.default[environment].address;

  const replacementAddress =
    Config.SWAP_TOKENS.find((token: SwapToken) => token.symbol === 'SAMB')
      ?.address ?? '';

  return path.map((token) =>
    token === nativeAddress ? replacementAddress : token
  ) as [string, string];
}

export function isETHtoWrapped(path: Array<string | undefined>) {
  return path[0] === addresses.AMB && path[1] === addresses.SAMB;
}

export function isWrappedToETH(path: Array<string | undefined>) {
  return path[0] === addresses.SAMB && path[1] === addresses.AMB;
}