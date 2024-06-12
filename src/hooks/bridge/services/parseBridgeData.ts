import {
  BridgePairsModel,
  NetworksNames,
  RenderTokenItem
} from '@models/Bridge';
import { Token } from '@lib/bridgeSDK/models/types';
import { DEFAULT_TOKEN_PAIRS } from '@contexts/Bridge/constants';
import { CryptoCurrencyCode } from '@appTypes';
import { Dispatch, SetStateAction } from 'react';
import Config from '@constants/config';

export const parseNetworkParams = (
  pair: BridgePairsModel,
  networksParamsSetter: Dispatch<SetStateAction<RenderTokenItem[] | undefined>>,
  tokenParamsSetter: (pairs: RenderTokenItem) => Promise<any>,
  fromId: NetworksNames
) => {
  const { name, pairs: tokenPair, provider } = pair;

  const SAMBinAMBAddress = Config.SAMB_IN_AMB;
  const SAMBinETHAddress = Config.SAMB2_IN_ETH;
  const SAMB2inETHAddress = Config.SAMB2_IN_ETH;

  const tokenFilter = (tokenPairs: Token[]) => {
    switch (name) {
      case 'amb->eth': {
        const fromAddressIsSAMBinAMB =
          tokenPairs[0].address === SAMBinAMBAddress;
        const toAddressIsSAMBinRTH = tokenPairs[1].address === SAMBinETHAddress;
        return !(fromAddressIsSAMBinAMB && toAddressIsSAMBinRTH);
      }
      case 'eth->amb': {
        const fromIsSAMB2inETH = tokenPairs[0].address === SAMB2inETHAddress;
        const toIsSAMBinAMB =
          tokenPairs[1].address === SAMBinAMBAddress &&
          !tokenPairs[1].isNativeCoin;
        return !(fromIsSAMB2inETH && toIsSAMBinAMB);
      }
      default:
        return true;
    }
  };

  const tokenForRender = tokenPair
    .filter((item) => tokenFilter(item))
    .map((tkn) => ({
      renderTokenItem: tkn[0],
      name,
      pairs: tkn,
      provider
    }));

  // @ts-ignore
  networksParamsSetter(tokenForRender || DEFAULT_TOKEN_PAIRS);

  const defaultToken = (() => {
    if (fromId !== 'amb') {
      return tokenForRender.find((token) => {
        const { symbol } = token.renderTokenItem;
        const isAMB = symbol === CryptoCurrencyCode.AMB;
        const isSAMB = symbol === CryptoCurrencyCode.SAMB;
        return isAMB || isSAMB;
      });
    } else {
      return tokenForRender.find((token) => token.renderTokenItem.isNativeCoin);
    }
  })();
  // @ts-ignore
  tokenParamsSetter(defaultToken || DEFAULT_TOKEN_PAIRS);
};
