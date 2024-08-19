import { Token } from '../types';

export function getTokenByAddress(
  address: string,
  tokens: Token[]
): Token | undefined {
  return tokens.find((el) => el.contractAddress === address);
}
