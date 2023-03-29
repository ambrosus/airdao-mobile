/**
 * Example: formatNumber(10000, 2) => 10,000.00
 */
const formatNumber = (amount: number, decimalPlaces = 2): string => {
  if (amount === undefined || amount == null) return '';
  const strAmount = amount.toFixed(decimalPlaces);
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
  return formattedString + strAmount.substring(startingIdx + 1);
};

export const NumberUtils = { formatNumber };
