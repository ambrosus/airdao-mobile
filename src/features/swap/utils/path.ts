import { SelectedTokensState } from '../types';

type Path = [string, string];

export function typedPath(selectedTokens: SelectedTokensState) {
  const { TOKEN_A, TOKEN_B } = selectedTokens;

  if (TOKEN_A && TOKEN_B) return [TOKEN_A.address, TOKEN_B.address] as Path;

  return [];
}
