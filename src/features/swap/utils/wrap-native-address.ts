import { ethers } from 'ethers';
import { useRodeoTokensStore } from '@entities/amb-rodeo-tokens/model';
import { TOKEN_ADDRESSES } from '@features/swap/entities';
import { SwapToken } from '@features/swap/types';
import { environment } from '@utils/environment';
import { transformTokensObject } from './transform-tokens-object';

export const addresses = TOKEN_ADDRESSES[environment];

export function isNativeWrapped(path: string[]) {
  const { tokens } = useRodeoTokensStore.getState();

  const wrappedPath = transformTokensObject(tokens).find(
    (token: SwapToken) => token.symbol === 'SAMB'
  )?.address;

  return path[0] === wrappedPath && path[1] === wrappedPath;
}

export function wrapNativeAddress(path: string[]): [string, string] {
  const { tokens } = useRodeoTokensStore.getState();
  const nativeAddress = ethers.constants.AddressZero;

  const replacementAddress =
    transformTokensObject(tokens).find(
      (token: SwapToken) => token.symbol === 'SAMB'
    )?.address ?? '';

  return path.map((token) =>
    token === nativeAddress ? replacementAddress : token
  ) as [string, string];
}

export function wrapNativeToken(token: SwapToken) {
  return token.address === ethers.constants.AddressZero
    ? { name: 'SAMB', symbol: 'SAMB', address: addresses.SAMB }
    : token;
}

export function isETHtoWrapped(path: Array<string | undefined>) {
  return path[0] === ethers.constants.AddressZero && path[1] === addresses.SAMB;
}

export function isWrappedToETH(path: Array<string | undefined>) {
  return path[0] === addresses.SAMB && path[1] === ethers.constants.AddressZero;
}
