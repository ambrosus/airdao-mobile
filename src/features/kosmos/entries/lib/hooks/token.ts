import { Token } from '../../types';

export function $token(address: string, tokens: Token[]): Token | undefined {
  return tokens.find((el) => el.contractAddress === address);
}
