import { isAndroid } from './isPlatform';

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
  if (allowDot) return str.replace(/[^.\d]+/g, '.');
  return str.replace(/[^\d]+/g, '');
};

const removeNonAlphabeticCharacters = (str: string): string => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z]+/g, '');
};

const formatNumberInput = (str: string): string => {
  const dottedStr = str.replaceAll(',', '.');
  // Check if the first character is a dot
  const isFirstCharacterDot = dottedStr.startsWith('.');
  const currentFlow = isFirstCharacterDot ? '0' + dottedStr : dottedStr;
  let numericChars = removeNonNumericCharacters(currentFlow);

  if (
    numericChars.length > 1 &&
    numericChars.startsWith('0') &&
    !numericChars.startsWith('0.')
  ) {
    numericChars = numericChars.slice(1);
  }

  if (/^0+$/.test(numericChars)) {
    return '0';
  }

  const [integerPart, decimalPart = ''] = numericChars.split(',');
  // Remove leading zeros from the integer part
  const formattedIntegerPart = integerPart.replace(/^0+(?=[1-9])/, '');
  let formattedDecimalPart = '';

  if (decimalPart) {
    formattedDecimalPart = '.' + decimalPart.replace(/(\.[1-9]*)0+$/, '$1');
  }

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

/**
 * Wraps a string for Android devices when not focused, adding ellipsis if it exceeds the maximum length.
 *
 * @param str - The input string to be wrapped.
 * @param focused - Indicates whether the input is focused.
 * @param maxLength - The maximum length of the string before wrapping. Defaults to 10.
 * @returns The wrapped string if conditions are met, otherwise the original string.
 */
function wrapAndroidString(
  str: string,
  focused: boolean,
  maxLength = 10,
  _isAndroid = isAndroid
): string {
  if (!focused && _isAndroid && str.length > maxLength) {
    return `${str.slice(0, maxLength)}...`;
  }
  return str;
}

const formatUri = ({
  uri,
  actions = ['format', 'cleanHttp'],
  formatLength = 25
}: {
  uri: string;
  actions?: ('cleanHttp' | 'format')[];
  formatLength?: number;
}): string => {
  let res = uri;

  const formatUriAction = {
    format: (_uri: string) => _uri.replace(/^https?:\/\//, ''),
    cleanHttp: (_uri: string) =>
      _uri.length > formatLength
        ? `${_uri.slice(0, formatLength - 3)}...`
        : _uri
  };

  actions.forEach((action) => {
    res = formatUriAction[action](res);
  });

  return res;
};

export const StringUtils = {
  formatAddress,
  pluralize,
  removeNonNumericCharacters,
  removeNonAlphabeticCharacters,
  formatNumberInput,
  wrapAndroidString,
  formatUri
};
