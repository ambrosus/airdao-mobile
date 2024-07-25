import { BigNumber, utils } from 'ethers';
import { Token, TxType } from '../types';

type ExtractTokenCallback = (address: string) => Token | undefined;

/**
 * Calculates the payment amount based on the payout token's price and amount.
 *
 * @param {Token | undefined} payoutToken - The token used for payout, including its price and decimal places.
 * @param {string} amount - The amount of the payout in string format.
 * @returns {number} - The computed payment amount in numerical format.
 */
function extractPaymentAmount(
  payoutToken: Token | undefined,
  amount: string
): number {
  const payoutBn = BigNumber.from(amount);
  const payout = utils.formatUnits(payoutBn, payoutToken?.decimals);
  return +payout * (payoutToken?.price || 0);
}

/**
 * Computes the total bonded amount from a list of transactions.
 *
 * @param {TxType[]} transactions - An array of transaction objects containing payout details.
 * @param {ExtractTokenCallback} extractTokenCb - A callback function to extract the token details.
 * @returns {number} - The total bonded amount, rounded up to 2 decimal places.
 */
export function totalBondedReducer(
  transactions: TxType[],
  extractTokenCb: ExtractTokenCallback
): number {
  const total = transactions.reduce((acc, curr) => {
    const payoutToken = extractTokenCb(curr.payoutToken);
    const payoutPrice = extractPaymentAmount(payoutToken, curr.payoutAmount);

    if (!curr.isClaimed) {
      return acc + payoutPrice;
    }
    return acc;
  }, 0);

  return Math.ceil(total * 100) / 100;
}

/**
 * Computes the total claimable amount from a list of transactions.
 *
 * @param {TxType[]} transactions - An array of transaction objects containing payout details.
 * @param {ExtractTokenCallback} extractTokenCb - A callback function to extract the token details.
 * @returns {number} - The total claimable amount.
 */
export function totalClaimableReducer(
  transactions: TxType[],
  extractTokenCb: ExtractTokenCallback
): number {
  return transactions.reduce((acc, curr) => {
    const payoutToken = extractTokenCb(curr.payoutToken);
    const payoutPrice = extractPaymentAmount(payoutToken, curr.payoutAmount);

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
