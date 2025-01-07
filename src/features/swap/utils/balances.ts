import { ethers } from 'ethers';
import Config from '@constants/config';
import { SwapToken } from '../types';

const tokens = Config.SWAP_TOKENS as SwapToken[];

export const initialBalances = tokens.reduce<
  Record<string, ethers.BigNumber>[]
>((acc, token) => {
  acc.push({ [token.address]: ethers.BigNumber.from(0) });
  return acc;
}, []);
