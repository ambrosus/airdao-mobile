import Config from '@constants/config';
import { RodeoToken } from '@entities/amb-rodeo-tokens/types';
import { SwapToken } from '../types';

export const transformTokensObject = (newTokens: RodeoToken[]): SwapToken[] => {
  return [
    ...Config.SWAP_TOKENS,
    ...newTokens.map((token) => {
      const { id: address, name, symbol } = token;

      return { address, name, symbol };
    })
  ];
};
