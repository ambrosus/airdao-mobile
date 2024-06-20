const DIGITS_TO_KEEP_MAP: { [key: number]: number } = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
  6: 0
};

const transformAmountValue = (value: string): string => {
  const [integerPart, fractionalPart] = value.toString().split('.');

  let integerLength = integerPart.length;
  if (integerLength > 5) integerLength = 5;

  const digitsToKeep = DIGITS_TO_KEEP_MAP[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const extendedLogoVariants = (symbol: string) =>
  symbol === 'SAMB' ? 'AMB' : symbol;

export const SwapStringUtils = { transformAmountValue, extendedLogoVariants };
