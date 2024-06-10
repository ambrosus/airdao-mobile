import { createContextSelector } from '@utils/createContextSelector';
import { useEffect, useMemo, useState } from 'react';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { AccountDBModel } from '@database';
import { API } from '@api/api';
import {
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK,
  DEFAULT_TOKEN_PAIRS
} from '@contexts/Bridge/constants';
import { getBridgeBalance } from '@lib';
import { NumberUtils } from '@utils/number';
import { formatEther } from 'ethers/lib/utils';

export const BridgeContext = () => {
  const [config, setConfig] = useState<any>({});
  const [selectedToken, setSelectedToken] =
    // @ts-ignore
    useState<RenderTokenItem>(DEFAULT_TOKEN_PAIRS);
  const [tokenDataLoader, setTokenDataLoader] = useState(false);

  const setSelectedTokenData = async (pairs: RenderTokenItem) => {
    try {
      setTokenDataLoader(true);
      const balance = await getBridgeBalance({
        from: from.id,
        token: pairs.renderTokenItem,
        ownerAddress: selectedAccount?.address || ''
      });
      const tokenData = {
        ...pairs
      };
      tokenData.renderTokenItem.balance =
        NumberUtils.limitDecimalCount(formatEther(balance?._hex), 2) || '';
      setSelectedToken(tokenData);
      return balance;
    } catch (e) {
      // ignore
    } finally {
      setTokenDataLoader(false);
    }
  };

  useEffect(() => {
    const getConfig = async () => {
      return await API.bridgeService.getBridgeParams();
    };
    getConfig().then(async (r) => {
      setConfig(r);
      // @ts-ignore
      await setSelectedTokenData(DEFAULT_TOKEN_PAIRS);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNetworkNames = (name: string) => {
    switch (name) {
      case 'eth':
        return 'Ethereum';
      case 'bsc':
        return 'BNB Chain';
      default:
        return 'AirDAO';
    }
  };
  const networkValidator = (way: ParsedBridge, value: ParsedBridge) => {
    const wayIsExternalNetwork = way.id === 'eth' || way.id === 'bsc';
    const isAmbNetwork = value.id === 'amb';
    const isBSCNetwork = value.id === 'bsc';
    const isETHNetwork = value.id === 'eth';
    const isExternalNetwork = isBSCNetwork || isETHNetwork;
    const isDuplicateWay = value.id === way.id;
    return {
      wayIsExternalNetwork,
      isAmbNetwork,
      isExternalNetwork,
      isDuplicateWay
    };
  };
  const [selectedAccount, setSelectedAccount] = useState<AccountDBModel | null>(
    null
  );
  const [from, setFrom] = useState(DEFAULT_AMB_NETWORK);
  const [to, setTo] = useState(DEFAULT_ETH_NETWORK);
  const [tokensForSelector, setTokensForSelector] =
    useState<RenderTokenItem[]>();

  const parsedBridges = Object.keys(config?.bridges || []).map((item) => {
    const res = {
      // @ts-ignore
      ...config?.bridges[item],
      id: item,
      name: getNetworkNames(item)
    };
    if (res.id === 'eth') {
      // tslint:disable-next-line:forin
      for (const key in DEFAULT_ETH_NETWORK) {
        // @ts-ignore
        DEFAULT_ETH_NETWORK[key] = res[key];
      }
    }
    return res;
  });
  const bridges: ParsedBridge[] = [...parsedBridges, DEFAULT_AMB_NETWORK];

  const fromSetter = (value: ParsedBridge) => {
    const {
      isAmbNetwork,
      isExternalNetwork,
      isDuplicateWay: isDuplicateTo,
      wayIsExternalNetwork: toIsExternalNetwork
    } = networkValidator(to, value);
    if (isDuplicateTo) {
      setTo(isAmbNetwork ? DEFAULT_ETH_NETWORK : DEFAULT_AMB_NETWORK);
    }
    if (isExternalNetwork && toIsExternalNetwork) {
      setTo(DEFAULT_AMB_NETWORK);
    }

    setFrom(value);
  };

  const toSetter = (value: ParsedBridge) => {
    const {
      isAmbNetwork,
      isExternalNetwork,
      isDuplicateWay: isDuplicateFrom,
      wayIsExternalNetwork: fromIsExternalNetwork
    } = networkValidator(from, value);
    if (isDuplicateFrom) {
      setFrom(isAmbNetwork ? DEFAULT_ETH_NETWORK : DEFAULT_AMB_NETWORK);
    }
    if (isExternalNetwork && fromIsExternalNetwork) {
      setFrom(DEFAULT_AMB_NETWORK);
    }

    setTo(value);
  };

  const networkNativeCoin = useMemo(() => {
    return (tokensForSelector || []).find(
      (item) => item.renderTokenItem.isNativeCoin
    )?.renderTokenItem;
  }, [tokensForSelector]);

  return {
    fromParams: {
      value: from,
      setter: fromSetter
    },
    toParams: {
      value: to,
      setter: toSetter
    },
    networksParams: {
      value: tokensForSelector,
      setter: setTokensForSelector
    },
    tokenParams: {
      value: selectedToken,
      setter: setSelectedTokenData,
      loader: tokenDataLoader
    },
    networkNativeCoin,
    bridges,
    setSelectedAccount,
    bridgeConfig: config,
    selectedAccount
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextSelector = () => useBridgeContext((v) => v);
