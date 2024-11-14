import { BigNumber, BigNumberish } from 'ethers';
import { Token } from '@lib/bridgeSDK/models/types';
import { parseUnits } from 'ethers/lib/utils';

const isAmountGraterThenBalance = ({
  balance,
  amount,
  token
}: {
  balance: BigNumber | BigNumberish | string;
  token?: Token;
  amount: string | BigNumber;
}) => {
  const decimals = token?.decimals ?? 18;
  if (!!+amount && !!balance) {
    const bigNumberAmount =
      typeof amount === 'string' ? parseUnits(amount, decimals) : amount;
    return bigNumberAmount.gt(balance);
  } else {
    return false;
  }
};

export const amountCheckers = {
  isAmountGraterThenBalance
};
