import Config from '@constants/config';
import { SWAP_SUPPORTED_TOKENS } from '@features/swap/entities';
import { environment } from '@utils/environment';
import { SwapToken } from '../types';
import { multiRouteAddresses } from '.';

export function isNativeWrapped(path: [string, string]) {
  const wrappedPath = Config.SWAP_TOKENS.find(
    (token: SwapToken) => token.symbol === 'SAMB'
  )?.address;

  const isPathSameAddress = path[0] === wrappedPath && path[1] === wrappedPath;

  return isPathSameAddress;
}

export function wrapNativeAddress(path: [string, string]): [string, string] {
  const nativeAddress = SWAP_SUPPORTED_TOKENS.default[environment].address;

  const replacementAddress =
    Config.SWAP_TOKENS.find((token: SwapToken) => token.symbol === 'SAMB')
      ?.address ?? '';

  return path.map((token) =>
    token === nativeAddress ? replacementAddress : token
  ) as [string, string];
}

export function isETHtoWrapped(path: [string | undefined, string | undefined]) {
  return (
    path[0] === multiRouteAddresses.AMB && path[1] === multiRouteAddresses.SAMB
  );
}

export function isWrappedToETH(path: [string | undefined, string | undefined]) {
  return (
    path[0] === multiRouteAddresses.SAMB && path[1] === multiRouteAddresses.AMB
  );
}
