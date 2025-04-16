import { ethers } from 'ethers';
import { useRodeoTokensStore } from '@entities/amb-rodeo-tokens/model';
import { transformTokensObject } from './transform-tokens-object';

const tokens = transformTokensObject(useRodeoTokensStore.getState().tokens);

export const initialBalances = tokens.reduce<
  Record<string, ethers.BigNumber>[]
>((acc, token) => {
  acc.push({ [token.address]: ethers.BigNumber.from(0) });
  return acc;
}, []);
