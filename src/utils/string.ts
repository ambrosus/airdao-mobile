/**
 *
 * @param paddingRight indicates how many chars should be visible left
 * @param paddingLeft indicates how many chars should be visible right
 * @returns
 */
const formatAddress = (
  address: string,
  paddingLeft: number,
  paddingRight: number,
  dotCount = 3
): string => {
  if (!address || typeof address !== 'string') return '';
  if (paddingLeft + paddingRight >= address.length) return address;
  let str = '';
  let dotCounter = 0;
  for (let i = 0; i < address.length; i++) {
    if (i < paddingLeft || address.length - i <= paddingRight)
      str += address[i];
    else if (dotCounter < dotCount) {
      str += '.';
      dotCounter++;
    }
  }
  return str;
};

const pluralize = (count: number, str: string, pluralForm?: string): string => {
  let finalForm = str;
  if (count > 1) {
    if (pluralForm) finalForm = pluralForm;
    else finalForm = str + 's';
  }
  return count + ' ' + finalForm;
};

const removeNonNumericCharacters = (str: string, allowDot = true): string => {
  if (!str) return '';
  if (allowDot) return str.replace(/[^.\d]+/g, '');
  return str.replace(/[^\d]+/g, '');
};

const removeNonAlphabeticCharacters = (str: string): string => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z]+/g, '');
};

const formatNumberInput = (str: string): string => {
  const dottedStr = str.replaceAll(',', '.');
  let numericChars = removeNonNumericCharacters(dottedStr);
  if (
    numericChars.startsWith('0') &&
    numericChars.length > 1 &&
    !numericChars.startsWith('0.')
  ) {
    numericChars = numericChars.slice(1);
  }

  const [integerPart, decimalPart = ''] = numericChars.split('.');
  const formattedIntegerPart = integerPart.replace(/^0+(?=[1-9])/, '');

  let formattedDecimalPart = '';
  if (decimalPart) {
    formattedDecimalPart = '.' + decimalPart.replace(/(\.[1-9]*)0+$/, '$1');
  }

  // Handle case when the input has only a decimal point
  if (str.includes('.') && !decimalPart) {
    formattedDecimalPart = '.';
  }

  return _removeExtraDots(formattedIntegerPart + formattedDecimalPart);
};

function _removeExtraDots(str: string): string {
  let firstDotFound = false;
  return str
    .split('')
    .filter((char) => {
      if (char === '.' && !firstDotFound) {
        firstDotFound = true;
        return true;
      }
      return char !== '.';
    })
    .join('');
}

export const StringUtils = {
  formatAddress,
  pluralize,
  removeNonNumericCharacters,
  removeNonAlphabeticCharacters,
  formatNumberInput
};
