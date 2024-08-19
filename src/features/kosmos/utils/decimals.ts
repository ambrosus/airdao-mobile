import { Token } from '../types';

export const formatDecimals = (
  amount: any,
  tokenAddress: string | undefined,
  tokens: Token[]
) => {
  const dp = tokens.find(
    (el) => tokenAddress === el.contractAddress
  )?.displayPrecision;
  return displayAmount(amount, dp);
};

const isFloat = (n: number | string) => {
  return Number(n) === n && n % 1 !== 0;
};

export const displayAmount = (n: number | string, dp: number | undefined) => {
  return isFloat(+n)
    ? +`${n.toString().split('.')[0]}.${n
        .toString()
        .split('.')[1]
        .substring(0, dp)}`
    : Number(n).toFixed(2);
};
