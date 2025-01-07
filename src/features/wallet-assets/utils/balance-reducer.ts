import { ethers } from 'ethers';
import { Token } from '@models';

export function balanceReducer(tokens: Token[], ambBalanceWei: string) {
  return tokens.reduce(
    (acc, curr) => acc.add(ethers.BigNumber.from(curr.balance.wei)),
    ethers.BigNumber.from(ambBalanceWei)
  );
}
