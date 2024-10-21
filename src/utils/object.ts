export const getObjectKeyByValue = (
  obj: { [key: string]: string },
  value: string
): string | undefined => {
  return Object.keys(obj).find((key) => obj[key] === value);
};
