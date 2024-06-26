export function resolvePlateSymbol(
  reversed: boolean,
  isExactIn: boolean,
  symbolA: string,
  symbolB: string
) {
  const reversedPath = reversed ? symbolA : symbolB;

  return {
    TOKEN_A: reversed ? reversedPath : isExactIn ? symbolA : symbolB,
    TOKEN_B: reversed ? reversedPath : !isExactIn ? symbolA : symbolB
  };
}
