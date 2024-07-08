import { SelectedTokensState } from '../types';

type Path = [string, string];

export function typedPathFromTokens(selectedTokens: SelectedTokensState): Path {
  const { TOKEN_A, TOKEN_B } = selectedTokens;

  if (TOKEN_A && TOKEN_B) return [TOKEN_A.address, TOKEN_B.address] as Path;

  return ['', ''];
}

export function typedPathFromAddresses(path: string[]) {
  const [addressFrom, addressTo] = path;

  return [addressFrom, addressTo] as [string, string];
}
