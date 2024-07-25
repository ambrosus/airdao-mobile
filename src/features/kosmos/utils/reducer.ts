import { BigNumber, utils } from 'ethers';
import { Token, TxType } from '../types';

type ExtractTokenCallback = (address: string) => Token | undefined;

export function totalBondedReducer(
  transactions: TxType[],
  extractTokenCb: ExtractTokenCallback
) {
  const total = transactions.reduce((acc, curr) => {
    const payoutToken = extractTokenCb(curr.payoutToken);
    const payoutBn = BigNumber.from(curr.payoutAmount);
    const payout = utils.formatUnits(payoutBn, payoutToken?.decimals);
    const payoutPrice = +payout * (payoutToken?.price || 0);

    if (!curr.isClaimed) {
      return acc + payoutPrice;
    }
    return acc;
  }, 0);

  return Math.ceil(total * 100) / 100;
}

export function totalClaimableReducer(
  transactions: TxType[],
  extractTokenCb: ExtractTokenCallback
) {
  return transactions.reduce((acc, curr) => {
    const payoutToken = extractTokenCb(curr.payoutToken);
    const payoutBn = BigNumber.from(curr.payoutAmount);
    const payout = utils.formatUnits(payoutBn, payoutToken?.decimals);
    const payoutPrice = +payout * (payoutToken?.price || 0);

    const vestingEndsDate =
      curr.vestingType === 'Fixed-expiry'
        ? +curr.vesting
        : +curr.vesting + curr.date;

    const isVestingPass = vestingEndsDate * 1000 < new Date().getTime();

    if (isVestingPass && !curr.isClaimed) {
      return acc + payoutPrice;
    }
    return acc;
  }, 0);
}
