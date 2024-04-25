import { BigNumber, utils } from 'ethers';

/**
 * Example: formatNumber(10000, 2) => 10,000.00
 */
const formatNumber = (amount: number, decimalPlaces = 2): string => {
  if (amount === undefined || amount == null) return '';
  const isNegative = amount < 0;
  const positiveAmount = Math.abs(amount);
  const strAmount = positiveAmount.toFixed(decimalPlaces);
  let formattedString = '';
  let counter = 0;
  const startingIdx =
    strAmount.indexOf('.') !== -1
      ? strAmount.indexOf('.') - 1
      : strAmount.length - 1;
  for (let idx = startingIdx; idx >= 0; idx--) {
    const ch = strAmount[idx];
    if (counter !== 0 && counter % 3 === 0) {
      formattedString = `,${formattedString}`;
      counter = 0;
    }
    formattedString = ch + formattedString;
    counter++;
  }
  return (
    (isNegative ? '-' : '') +
    formattedString +
    strAmount.substring(startingIdx + 1)
  );
};

// limits the number of decimal places of a number in the format of e.g 245.82
const limitDecimalCount = (
  number: string | number,
  decimalPlaces: number
): string => {
  let str = number.toString();
  const parts = str.split('.');
  if (str.includes('.') && parts[1] && parts[1].length > decimalPlaces) {
    if (decimalPlaces === 0) str = parts[0];
    else if (parts[1].length > decimalPlaces) {
      parts[1] = parts[1].substring(0, decimalPlaces);
      str = parts.join('.');
    }
  }
  return str;
};

const addSignToNumber = (num: number): string => {
  const shouldAddMinus = num.toString() && num.toString()[0] !== '-';
  return (num > 0 ? '+' : shouldAddMinus ? '-' : '') + num;
};

const abbreviateNumber = (num: number): string => {
  let newValue = num.toString();
  if (num >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    const suffixNum = Math.floor(Math.log10(Math.abs(num)) / 3);
    let shortValue = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0 ? num / Math.pow(1000, suffixNum) : num).toFixed(
          precision
        )
      ).toString();
      const dotLessShortValue = (shortValue + '').replace(
        /[^a-zA-Z 0-9]+/g,
        ''
      );
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    newValue = shortValue + (suffixes[suffixNum] || '');
  }
  return newValue;
};

export const formatAmount = (amount: BigNumber, afterDotAmount = 2) => {
  const amountFloatString = utils.formatEther(amount);

  const [intPart, floatPart] = amountFloatString.split('.');
  let amountBalance;
  if (floatPart && afterDotAmount === 0) {
    amountBalance = intPart;
  } else if (floatPart && floatPart.length > afterDotAmount) {
    amountBalance = `${intPart}.${floatPart.slice(0, afterDotAmount)}`;
  } else if (floatPart) {
    amountBalance = `${intPart}.${floatPart}`;
  } else {
    amountBalance = intPart;
  }
  return amountBalance;
};

const minimiseAmount = (num: number): string => {
  if (!num || num === 0) return '0.00';

  const suffixes = ['', 'k', 'mln', 'bln', 'trln'];
  const absNum = Math.abs(num);
  let suffixIndex = Math.floor(Math.log10(absNum) / 3);

  suffixIndex = Math.max(0, Math.min(suffixIndex, suffixes.length - 1));

  const scaledNum = (num / Math.pow(10, suffixIndex * 3)).toFixed(2);
  return `${scaledNum}${suffixes[suffixIndex]}`;
};

export const NumberUtils = {
  formatNumber,
  addSignToNumber,
  abbreviateNumber,
  limitDecimalCount,
  formatAmount,
  minimiseAmount
};
