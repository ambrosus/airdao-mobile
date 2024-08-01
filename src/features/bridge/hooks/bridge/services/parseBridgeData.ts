import {
  BridgePairsModel,
  NetworksNames,
  RenderTokenItem
} from '@models/Bridge';
import { DEFAULT_TOKEN_PAIRS } from '../../../constants';
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
      const isAMBToken = tokenForRender.find(
        (token) => token.renderTokenItem.symbol === CryptoCurrencyCode.AMB
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
