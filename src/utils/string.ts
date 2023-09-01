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

const removeNonNumericCharacters = (str: string): string => {
  if (!str) return '';
  return str.replace(/[^.\d]+/g, '');
};

const formatNumberInput = (str: string): string => {
  let numericChars = removeNonNumericCharacters(str);
  if (numericChars[0] === '.') numericChars = '0' + numericChars;
  return numericChars;
};

export const StringUtils = {
  formatAddress,
  pluralize,
  removeNonNumericCharacters,
  formatNumberInput
};
