import { BridgeSDK } from '@lib/bridgeSDK/sdk/sdk';
import { Network, Token } from '@lib/bridgeSDK/models/types';
import { CryptoCurrencyCode } from '@appTypes';
import { bridgeTokensPairFilter } from '@lib/bridgeSDK/bridgeFunctions/bridgeTokensPairFilter';
import Config from '@constants/config';

export class MySdk extends BridgeSDK {
  getPairs(
    sourceNetwork: Network,
    destinationNetwork: Network
  ): [Token, Token][] {
    const result = super.getPairs(sourceNetwork, destinationNetwork);
    const bridgePairName = `${sourceNetwork}->${destinationNetwork}`;
    // @ts-ignore
    return result
      .filter(([from, to]) =>
        bridgeTokensPairFilter({ pair: [from, to], bridgePairName })
      )
      .map(([from, to]) => [this.mapToken(from), this.mapToken(to)])
      .reverse();
  }

  mapToken(token: Token): Token {
    const { SAMB_IN_AMB, SAMB_IN_ETH } = Config;
    const isNativeETH =
      token.isNativeCoin && token.symbol === CryptoCurrencyCode.WETH;

    const isNativeBNB =
      token.isNativeCoin && token.symbol === CryptoCurrencyCode.WBNB;

    const isNativeAMB =
      token.address === SAMB_IN_AMB &&
      token.isNativeCoin &&
      token.network === 'amb';

    const isSAMBinETH =
      token.address === SAMB_IN_ETH && token.network === 'eth';

    const isSAMBinAMB =
      token.address === SAMB_IN_AMB &&
      !token.isNativeCoin &&
      token.network === 'amb';

    if (isNativeETH || isNativeBNB) {
      token.name = isNativeETH ? 'ETH' : 'BNB';
    }
    if (isNativeAMB) {
      token.name = 'Amber';
      token.symbol = CryptoCurrencyCode.AMB;
    }
    if (isSAMBinETH || isSAMBinAMB) {
      token.name = 'Synthetic Amber';
      token.symbol = CryptoCurrencyCode.SAMB;
    }

    return token;
  }
}
