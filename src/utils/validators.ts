const isStringAddress = (str: string) => {
  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  return addressRegex.test(str);
};

export const StringValidators = {
  isStringAddress
};
