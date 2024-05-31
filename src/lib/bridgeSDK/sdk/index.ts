import { BridgeSDK } from '@lib/bridgeSDK/sdk/sdk';
import { Network, Token } from '@lib/bridgeSDK/models/types';

export class MySdk extends BridgeSDK {
  getPairs(
    sourceNetwork: Network,
    destinationNetwork: Network
  ): [Token, Token][] {
    const result = super.getPairs(sourceNetwork, destinationNetwork);
    return result.map(([from, to]) => [this.mapToken(from), this.mapToken(to)]);
  }

  mapToken(token: Token): Token {
    if (token.isNativeCoin) token.name += ' (NATIVE)';
    return token;
  }
}
