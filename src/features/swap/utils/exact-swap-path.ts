export function exactSwapPath(
  isExactIn: boolean,
  path: [string | undefined, string | undefined]
): [string, string] {
  const [fromAddress, toAddress] = path;

  if (fromAddress && toAddress) {
    return isExactIn ? [fromAddress, toAddress] : [toAddress, fromAddress];
  }

  return ['', ''];
}
