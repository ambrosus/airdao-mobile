export function executeSwapPath(
  isExactIn: boolean,
  path: Array<string | undefined>
): [string, string] {
  const [fromAddress, toAddress] = path;

  if (fromAddress && toAddress) {
    return isExactIn ? [fromAddress, toAddress] : [toAddress, fromAddress];
  }

  return ['', ''];
}
