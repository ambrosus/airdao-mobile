const LIQUIDITY_PROVIDER_FEE = 0.003;

export function realizedLPFee(amountToSell: string) {
  const liquidityProviderFee = +amountToSell * LIQUIDITY_PROVIDER_FEE;

  return liquidityProviderFee.toFixed(2);
}

export function subtractRealizedLPFeeFromInput(amountToSell: string) {
  const liquidityProviderFee = +amountToSell * LIQUIDITY_PROVIDER_FEE;

  return String(+amountToSell - +liquidityProviderFee);
}
