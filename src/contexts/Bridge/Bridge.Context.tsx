import { createContextSelector } from '@utils/createContextSelector';
import { useEffect, useState } from 'react';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { AccountDBModel } from '@database';
import { API } from '@api/api';
import {
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK,
  DEFAULT_TOKEN_PAIRS
} from '@contexts/Bridge/constants';

export const BridgeContext = () => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    const getConfig = async () => {
      return await API.bridgeService.getBridgeParams();
    };
    getConfig().then((r) => {
      setConfig(r);
    });
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
  const [selectedToken, setSelectedToken] =
    // @ts-ignore
    useState<RenderTokenItem>(DEFAULT_TOKEN_PAIRS);
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
      setter: setSelectedToken
    },
    bridges,
    setSelectedAccount,
    bridgeConfig: config,
    selectedAccount
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextSelector = () => useBridgeContext((v) => v);
