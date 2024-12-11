import { Token } from '@models';
import { ethers } from 'ethers';

export function balanceReducer(tokens: Token[], ambBalanceWei: string) {
  return tokens.reduce(
    (acc, curr) => acc.add(ethers.BigNumber.from(curr.balance.wei)),
    ethers.BigNumber.from(ambBalanceWei)
  );
}
