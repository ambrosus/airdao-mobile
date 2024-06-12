import Config from '@constants/config';
import { DEX_SUPPORTED_TOKENS } from '../entities/tokens';
import { environment } from './environment';

export function isNativeWrapped(path: string[]) {
  const wrappedPath = DEX_SUPPORTED_TOKENS.tokens[environment].find(
    (token) => token.symbol === 'SAMB'
  )?.address;

  const isPathSameAddress = path[0] === wrappedPath && path[1] === wrappedPath;

  return isPathSameAddress;
}

export function wrapNativeAddress(path: [string, string]): [string, string] {
  const nativeAddress = DEX_SUPPORTED_TOKENS.default[environment].address;
  const replacementAddress =
    Config.DEX_SUPPORTED_TOKENS.find((token) => token.symbol === 'SAMB')
      ?.address ?? '';

  return path.map((token) =>
    token === nativeAddress ? replacementAddress : token
  ) as [string, string];
}
