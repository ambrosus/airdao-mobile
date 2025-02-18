import { ethers } from 'ethers';

const BETTER_TRADE_LESS_HOPS_THRESHOLD = ethers.BigNumber.from(50)
  .mul(ethers.BigNumber.from(100))
  .div(ethers.BigNumber.from(10000)); // 0.5%

/**
 * Compares two trade amounts to determine if the second trade is better than the first
 * by at least the minimum threshold (0.5%)
 * @param amountA First trade amount
 * @param amountB Second trade amount
 * @returns boolean - true if amountB is better than amountA by at least 0.5%
 */
export function isTradeBetter(
  amountA: ethers.BigNumber,
  amountB: ethers.BigNumber
): boolean {
  // Handle edge cases
  if (amountA.isZero() && !amountB.isZero()) return true;
  if (!amountA.isZero() && amountB.isZero()) return false;
  if (amountA.isZero() && amountB.isZero()) return false;

  // Calculate the improvement percentage (in basis points)
  const improvement = amountB
    .sub(amountA)
    .mul(ethers.BigNumber.from(10000))
    .div(amountA);

  // Return true if improvement is >= 0.5%
  return improvement.gte(BETTER_TRADE_LESS_HOPS_THRESHOLD);
}
