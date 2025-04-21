import { Dispatch, SetStateAction } from 'react';
import { CryptoCurrencyCode } from '@appTypes';
import {
  BridgePairsModel,
  NetworksNames,
  RenderTokenItem
} from '@models/Bridge';
import { DEFAULT_TOKEN_PAIRS } from '../../../constants';

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
    if (fromId !== 'asc') {
      const isAMBToken = tokenForRender.find(
        (token) => token.renderTokenItem.symbol === CryptoCurrencyCode.ASC
      );
      const isSAMBToken = tokenForRender.find(
        (token) => token.renderTokenItem.symbol === CryptoCurrencyCode.SAMB
      );
      return isAMBToken || isSAMBToken;
    } else {
      return tokenForRender.find((token) => token.renderTokenItem.isNativeCoin);
    }
  })();
  // @ts-ignore
  tokenParamsSetter(defaultToken || DEFAULT_TOKEN_PAIRS);
};
