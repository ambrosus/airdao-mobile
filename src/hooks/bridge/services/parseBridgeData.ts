import {
  BridgePairsModel,
  NetworksNames,
  RenderTokenItem
} from '@models/Bridge';
import { DEFAULT_TOKEN_PAIRS } from '@contexts/Bridge/constants';
import { CryptoCurrencyCode } from '@appTypes';
import { Dispatch, SetStateAction } from 'react';

export const parseNetworkParams = (
  pair: BridgePairsModel,
  networksParamsSetter: Dispatch<SetStateAction<RenderTokenItem[] | undefined>>,
  tokenParamsSetter: (pairs: RenderTokenItem) => Promise<any>,
  fromId: NetworksNames
) => {
  const { name, pairs: tokenPair, provider } = pair;

  const tokenForRender = tokenPair.map((tkn) => ({
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
