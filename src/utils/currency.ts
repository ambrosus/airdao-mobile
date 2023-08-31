const toCrypto = (usd: number, rate: number) => usd / rate;
const toUSD = (crypto: number, rate: number) => crypto * rate;

export const CurrencyUtils = { toCrypto, toUSD };
