const isEmptyAmount = (value: string) => {
  return /^0(\.0+)?$|^$/.test(value);
};

export const dexValidators = {
  isEmptyAmount
};
