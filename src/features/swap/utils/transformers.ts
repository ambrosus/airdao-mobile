import { ethers } from 'ethers';

const DIGITS_TO_KEEP_MAP: { [key: number]: number } = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
  6: 0
};

const MIN_RECEIVED_DIGITS_TO_KEEP_MAP: { [key: number]: number } = {
  1: 3,
  2: 2,
  3: 1,
  4: 0
};

const LP_FEE_DIGITS_TO_KEEP_MAP: { [key: number]: number } = {
  1: 3,
  2: 2,
  3: 1,
  4: 0
};

const transformAmountValue = (value: string): string => {
  const [integerPart, fractionalPart] = value.toString().split('.');

  let integerLength = integerPart.length;
  if (integerLength > 6) integerLength = 6;

  const digitsToKeep = DIGITS_TO_KEEP_MAP[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const transformMinAmountValue = (bnMinimumAmount: ethers.BigNumber): string => {
  const value = ethers.utils.formatEther(bnMinimumAmount);
  const [integerPart, fractionalPart] = value.toString().split('.');

  let integerLength = integerPart.length;
  if (integerLength > 4) integerLength = 4;

  const digitsToKeep = MIN_RECEIVED_DIGITS_TO_KEEP_MAP[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const transformRealizedLPFee = (value: string) => {
  const [integerPart, fractionalPart] = value.split('.');

  let integerLength = integerPart.length;
  if (integerLength > 4) integerLength = 4;

  const digitsToKeep = LP_FEE_DIGITS_TO_KEEP_MAP[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const extendedLogoVariants = (symbol: string) =>
  symbol === 'SAMB' ? 'AMB' : symbol;

export const SwapStringUtils = {
  transformAmountValue,
  extendedLogoVariants,
  transformMinAmountValue,
  transformRealizedLPFee
};
