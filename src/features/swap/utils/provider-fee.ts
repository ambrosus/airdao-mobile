const LIQUIDITY_PROVIDER_FEE = 0.003;

export function realizedLPFee(amountToSell: string) {
  return +amountToSell * LIQUIDITY_PROVIDER_FEE;
}

export function subtractRealizedLPFeeFromInput(amountToSell: string) {
  const liquidityProviderFee = realizedLPFee(amountToSell);

  return String(+amountToSell - +liquidityProviderFee);
}

export function calculateAllowanceWithProviderFee(amountToSell: string) {
  const liquidityProviderFee = realizedLPFee(amountToSell);

  return String(+amountToSell + +liquidityProviderFee);
}
