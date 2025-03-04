import { ethers } from 'ethers';
import { split, toString } from 'lodash';

const AMOUNT_FLOAT_DIGITS_LENGTH: { [key: number]: number } = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1
};

const MIN_RECEIVED_FLOAT_DIGITS_LENGTH: { [key: number]: number } = {
  1: 4,
  2: 3,
  3: 2,
  4: 1
};

const LPFEE_FLOAT_DIGITS_LENGTH: { [key: number]: number } = {
  1: 6,
  2: 5,
  3: 4,
  4: 3,
  5: 2,
  6: 1
};

const transformAmountValue = (value: string): string => {
  const [integerPart, fractionalPart] = value.toString().split('.');

  let integerLength = integerPart.length;
  if (integerLength > 5) integerLength = 5;

  const digitsToKeep = AMOUNT_FLOAT_DIGITS_LENGTH[integerLength] ?? 1;
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

  const digitsToKeep = MIN_RECEIVED_FLOAT_DIGITS_LENGTH[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const transformRealizedLPFee = (value: string) => {
  const [integerPart, fractionalPart] = value.split('.');

  let integerLength = integerPart.length;
  if (integerLength > 4) integerLength = 4;

  const digitsToKeep = LPFEE_FLOAT_DIGITS_LENGTH[integerLength] ?? 1;
  let formattedNumber = integerPart;

  if (fractionalPart)
    formattedNumber += `.${fractionalPart.slice(0, digitsToKeep)}`;

  return formattedNumber.replace(/(\.\d*[1-9])0+$/, '$1').replace(/\.0*$/, '');
};

const transformSlippageOnBlur = (value: string | undefined) => {
  if (value) {
    let formattedValue = value;
    if (!value.includes('.')) {
      return (formattedValue = value + '.00');
    } else {
      const [integer, decimal] = value.split('.');
      if (decimal.length === 1) {
        return (formattedValue = `${integer}.${decimal}0`);
      }
    }
    return formattedValue;
  }
};

const transformCurrencyRate = (payload: number) => {
  const [integerPart] = split(toString(payload), '.');
  const integerLength = integerPart.length;

  return toString(payload.toFixed(AMOUNT_FLOAT_DIGITS_LENGTH[integerLength]));
};

const transformSlippageValue = (value: string) => {
  return +value * 100;
};

const extendedLogoVariants = (symbol: string) =>
  symbol === 'SAMB' ? 'AMB' : symbol;

export const SwapStringUtils = {
  transformAmountValue,
  extendedLogoVariants,
  transformMinAmountValue,
  transformRealizedLPFee,
  transformSlippageValue,
  transformSlippageOnBlur,
  transformCurrencyRate
};
