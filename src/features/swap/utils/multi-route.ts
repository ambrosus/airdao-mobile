import { SWAP_SUPPORTED_TOKENS } from '@features/swap/entities';
import { environment } from '@utils/environment';
import { addresses } from './wrap-native-address';

export const MAX_HOPS = 3;

export const isMultiHopSwapAvailable = (path: string[]): boolean => {
  return extractArrayOfMiddleMultiHopAddresses(path).length === 0;
};

export const withMultiHopPath = (path: string[]): string[] => {
  return path.map((address) =>
    address === addresses.ASC ? addresses.SAMB : address
  );
};

const ignoreTokenAddresses = [
  // @ts-ignore
  addresses.STAMB,
  addresses.SAMB,
  // @ts-ignore
  addresses.HBR,
  // @ts-ignore
  addresses.AST,
  // @ts-ignore
  addresses.KOS,
  // @ts-ignore
  addresses.SWINE
] as const;

export const generateAllPossibleRoutes = (
  path: string[],
  maxHops = MAX_HOPS
): string[][] => {
  const [startToken, endToken] = path;
  if (!startToken || !endToken) return [];

  // Check if path includes addresses.SAMB
  const includesSAMB = path.includes(addresses.SAMB);

  const availableTokens = SWAP_SUPPORTED_TOKENS.tokens[environment]
    .filter(
      (token) =>
        !ignoreTokenAddresses.includes(token.address) &&
        token.address !== startToken &&
        token.address !== endToken &&
        !(includesSAMB && token.address === addresses.ASC) // Exclude AMB if SAMB is in path
    )
    .map((token) => token.address);

  const routes: string[][] = [];

  // Add direct path
  routes.push([startToken, endToken]);

  // Add single-hop paths
  availableTokens.forEach((middleToken) => {
    routes.push([startToken, middleToken, endToken]);
  });

  // Add multi-hop paths if maxHops > 2
  if (maxHops > 2) {
    for (let i = 0; i < availableTokens.length - 1; i++) {
      for (let j = i + 1; j < availableTokens.length; j++) {
        routes.push([
          startToken,
          availableTokens[i],
          availableTokens[j],
          endToken
        ]);
      }
    }
  }

  return routes;
};

export const extractArrayOfMiddleMultiHopAddresses = (
  path: string[]
): string[] => {
  const availableTokens = SWAP_SUPPORTED_TOKENS.tokens[environment].filter(
    (token) => token.symbol !== 'SAMB'
  );

  // Return array of addresses instead of token objects
  return availableTokens
    .filter((token) => !path.includes(token.address))
    .map((token) => token.address);
};
