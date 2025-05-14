import { BigNumber, utils } from 'ethers';

/**
 * Example: formatNumber(10000, 2) => 10,000.00
 * Example: formatNumber(30,3634552345262345, 2) => 30.36
 * Example: formatNumber(0,3634552345262345, 2) => 0.36
 */
const formatNumber = (amount: number, decimalPlaces = 2): string => {
  if (amount === undefined || amount == null) return '';
  const isNegative = amount < 0;
  const positiveAmount = Math.abs(amount);
  const strAmount = positiveAmount.toString();
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
  const leftPart = (isNegative ? '-' : '') + formattedString;

  if (decimalPlaces === 0) {
    return leftPart;
  }

  const rightPart = strAmount
    .substring(startingIdx + 1)
    .slice(0, decimalPlaces + 1);
  const result = limitDecimalCount(leftPart + rightPart, decimalPlaces);
  return result;
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

export const formatAmount = (
  amount: BigNumber | number | string,
  afterDotAmount = 2
) => {
  const amountFloatString = utils.formatEther(amount);

  const [intPart, floatPart] = amountFloatString.split('.');
  let amountBalance;
  if (floatPart && afterDotAmount === 0) {
    amountBalance = intPart;
  } else if (floatPart && floatPart.length > afterDotAmount) {
    amountBalance = `${intPart}.${floatPart.slice(0, afterDotAmount)}`;
  } else if (+floatPart > 0) {
    amountBalance = `${intPart}.${floatPart}`;
  } else {
    amountBalance = intPart;
  }
  return amountBalance;
};

const minimiseAmount = (num: number): string => {
  if (!num || num === 0) return '0.00';

  const suffixes = ['', 'k', 'm', 'bln', 'trln'];
  const absNum = Math.abs(num);
  let suffixIndex = Math.floor(Math.log10(absNum) / 3);

  suffixIndex = Math.max(0, Math.min(suffixIndex, suffixes.length - 1));

  const scaledNum = (num / Math.pow(10, suffixIndex * 3)).toFixed(2);
  return `${scaledNum}${suffixes[suffixIndex]}`;
};

const numberToTransformedLocale = (value: string | number) => {
  const amount = parseFloat(value.toString().replace(/,/g, ''));

  // Check if the number is zero and has a negative symbol
  if (amount === 0 && value.toString().startsWith('-')) {
    return '0';
  }

  if (amount < 0.01) {
    return '0.00';
  }

  const [intPart, floatPart] = amount.toString().split('.');

  if (amount % 1 === 0) {
    return amount.toLocaleString('en-US');
  }

  const formattedIntPart = parseInt(intPart, 10).toLocaleString('en-US');
  const formattedFloatPart = floatPart ? floatPart.slice(0, 2) : '00';

  return formattedFloatPart === '00'
    ? formattedIntPart
    : `${formattedIntPart}.${formattedFloatPart}`;
};

const formatDecimal = (value: string, decimals = 2): string => {
  const fixed = Number(value).toFixed(decimals);
  return fixed.replace(/\.?0+$/, '');
};

const toSignificantDigits = (value: string, significantDigits = 6): string => {
  if (!value) return '';
  if (value === '0' || value === '0.') return value;
  if (value.endsWith('.')) return value;

  // Parse the number
  const num = parseFloat(value);
  if (isNaN(num)) return '';

  // Special case: very small numbers with scientific notation
  if (Math.abs(num) < 0.000001) {
    // Handle scientific notation for small numbers
    const parts = num.toString().split('e-');
    if (parts.length === 2) {
      const mantissa = parseFloat(parts[0]);
      const exponent = parseInt(parts[1], 10);

      // Format with correct zeros
      let result = '0.';
      for (let i = 0; i < exponent - 1; i++) {
        result += '0';
      }

      // Add the mantissa digits without decimal point, preserving exactly significantDigits
      let digits = mantissa.toString().replace('.', '');
      // Ensure we have enough digits
      while (digits.length < significantDigits) {
        digits += '0';
      }
      // Take only significantDigits
      digits = digits.substring(0, significantDigits);

      result += digits;
      return result;
    }
  }

  // Handle both large numbers and decimal numbers properly
  const formatToSignificantDigits = (n: number, sigDigits: number): string => {
    const absN = Math.abs(n);
    const strN = absN.toString();
    const decimalPos = strN.indexOf('.');

    // For integers (no decimal point)
    if (decimalPos === -1) {
      // If number already has fewer digits than sigDigits, return as is
      if (strN.length <= sigDigits) {
        return n.toString();
      }

      // Otherwise, truncate to significant digits for large integers
      const truncateFactor = Math.pow(10, strN.length - sigDigits);
      const truncated = Math.floor(absN / truncateFactor) * truncateFactor;
      return (n < 0 ? '-' : '') + truncated.toString();
    }

    // For decimal numbers
    const intPart = decimalPos > 0 ? strN.substring(0, decimalPos) : '0';
    const decimalPart = strN.substring(decimalPos + 1);

    // If integer part has enough digits
    if (intPart.length >= sigDigits) {
      const truncateFactor = Math.pow(10, intPart.length - sigDigits);
      const truncated = Math.floor(absN / truncateFactor) * truncateFactor;
      return (n < 0 ? '-' : '') + truncated.toString();
    }

    // For numbers with leading zeros in decimal part
    if (intPart === '0') {
      let leadingZeros = 0;
      for (let i = 0; i < decimalPart.length; i++) {
        if (decimalPart[i] === '0') {
          leadingZeros++;
        } else {
          break;
        }
      }

      // Calculate how many significant digits we need from the decimal part
      const neededFromDecimal = sigDigits;

      // Start with "0."
      let result = '0.';

      // Add leading zeros
      for (let i = 0; i < leadingZeros; i++) {
        result += '0';
      }

      // Add significant digits after leading zeros
      result += decimalPart.substring(
        leadingZeros,
        leadingZeros + neededFromDecimal
      );

      return (n < 0 ? '-' : '') + result;
    }

    // For mixed numbers (with non-zero integer part and decimals)
    const availableFromInt = intPart.length;
    const neededFromDecimal = sigDigits - availableFromInt;

    let result = intPart + '.';
    result += decimalPart.substring(0, neededFromDecimal);

    return (n < 0 ? '-' : '') + result;
  };

  return formatToSignificantDigits(num, significantDigits);
};

export const NumberUtils = {
  formatNumber,
  addSignToNumber,
  abbreviateNumber,
  limitDecimalCount,
  formatAmount,
  minimiseAmount,
  numberToTransformedLocale,
  formatDecimal,
  toSignificantDigits
};
