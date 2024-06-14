import { BridgeSDK } from '@lib/bridgeSDK/sdk/sdk';
import { Network, Token } from '@lib/bridgeSDK/models/types';
import { CryptoCurrencyCode } from '@appTypes';
import { bridgeTokensPairFilter } from '@lib/bridgeSDK/bridgeFunctions/bridgeTokensPairFilter';

export class MySdk extends BridgeSDK {
  getPairs(
    sourceNetwork: Network,
    destinationNetwork: Network
  ): [Token, Token][] {
    const result = super.getPairs(sourceNetwork, destinationNetwork);
    const bridgePairName = `${sourceNetwork}->${destinationNetwork}`;
    return result
      .filter(([from, to]) =>
        bridgeTokensPairFilter({ pair: [from, to], bridgePairName })
      )
      .map(([from, to]) => [this.mapToken(from), this.mapToken(to)]);
  }

  mapToken(token: Token): Token {
    const isNativeETH =
      token.isNativeCoin && token.symbol === CryptoCurrencyCode.WETH;
    const isNativeBNB =
      token.isNativeCoin && token.symbol === CryptoCurrencyCode.WBNB;
    if (isNativeETH || isNativeBNB) {
      token.name = isNativeETH ? 'Ether' : 'BNB';
    }
    return token;
  }
}
