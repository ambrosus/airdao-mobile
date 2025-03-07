import { BigNumber } from 'ethers';
import { NumberUtils } from '@utils/number';

export function singleHopImpact(
  amountIn: string,
  amountOut: BigNumber,
  reserveIn: BigNumber,
  reserveOut: BigNumber
): string {
  const newAmountIn = String(NumberUtils.limitDecimalCount(amountIn, 0));
  // @ts-ignore
  const initialPrice = reserveOut / reserveIn;
  const newReserveIn = reserveIn.add(newAmountIn);
  const newReserveOut = reserveOut.sub(amountOut);
  // @ts-ignore
  const newPrice = newReserveOut / newReserveIn;
  const priceImpact = ((newPrice - initialPrice) / initialPrice) * 100;

  return priceImpact.toString();
}

export function multiHopCumulativeImpact(
  intermediateImpact: string,
  finalImpact: string
) {
  const intermediateImpactDecimal = +intermediateImpact / 100;
  const finalImpactDecimal = +finalImpact / 100;

  const cumulativeImpact =
    (1 + intermediateImpactDecimal) * (1 + finalImpactDecimal) - 1;
  const cumulativeImpactPercentage = cumulativeImpact * 100;

  const roundedCumulativeImpactPercentage =
    Math.round(cumulativeImpactPercentage * 100) / 100;

  return cumulativeImpactPercentage >= 0
    ? roundedCumulativeImpactPercentage
    : -roundedCumulativeImpactPercentage;
}
