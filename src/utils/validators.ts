import { ethereumAddressRegex } from '@constants/regex';

const isStringAddress = (str: string) => {
  return ethereumAddressRegex.test(str);
};

export const StringValidators = {
  isStringAddress
};
