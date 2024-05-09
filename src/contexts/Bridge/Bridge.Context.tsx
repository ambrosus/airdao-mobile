import { createContextSelector } from '@utils/createContextSelector';
import { useEffect, useState } from 'react';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { AccountDBModel } from '@database';
import { API } from '@api/api';

const DEFAULT_AMB_NETWORK = {
  side: '0x0000000000',
  amb: '1x1111111111',
  id: 'amb',
  name: 'AirDAO'
};
const DEFAULT_ETH_NETWORK = {
  amb: '0x0000000000',
  id: 'eth',
  name: 'Ethereum',
  side: '1x1111111111'
};

const DEFAULT_TOKEN = {
  name: 'amb->eth',
  pairs: [
    {
      address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
      bridgeNetwork: 'eth',
      decimals: 18,
      isNativeCoin: true,
      name: 'AirDAO (NATIVE)',
      network: 'amb',
      symbol: 'USDT'
    },
    {
      address: '0xf4fB9BF10E489EA3Edb03E094939341399587b0C',
      bridgeNetwork: 'eth',
      decimals: 18,
      isNativeCoin: false,
      name: 'AirDAO',
      network: 'eth',
      symbol: 'AMB'
    }
  ],
  renderTokenItem: {
    address: '0x2b2d892C3fe2b4113dd7aC0D2c1882AF202FB28F',
    bridgeNetwork: 'eth',
    decimals: 18,
    isNativeCoin: true,
    name: 'AirDAO (NATIVE)',
    network: 'amb',
    symbol: 'AMB'
  }
};

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
  const [selectedToken, setSelectedToken] = useState(DEFAULT_TOKEN);
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
      for (const key in DEFAULT_ETH_NETWORK) {
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
