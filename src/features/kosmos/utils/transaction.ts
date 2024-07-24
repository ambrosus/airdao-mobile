import { utils } from 'ethers';

export function calculatedProtocolFee(amount: string, protocolFee: number) {
  return (+amount * protocolFee) / 100;
}

export function _willGetSubFee(
  amount: string,
  protocolFee: number,
  slippage: number,
  bondMarketPrice: number
) {
  const fee = calculatedProtocolFee(amount, protocolFee);
  return utils.parseUnits(
    ((+amount - fee - slippage) * bondMarketPrice).toFixed(18).toString(),
    18
  );
}

export function _willGet(amount: string, bondMarketPrice: number) {
  return utils.parseUnits((+amount * bondMarketPrice).toString(), 18);
}
