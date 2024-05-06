import { createContextSelector } from '@utils/createContextSelector';
import { useState } from 'react';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import Config from '@constants/config';
import { AccountDBModel } from '@database';

const DEFAULT_AMB_NETWORK = {
  side: '0x0000000000',
  amb: '1x1111111111',
  id: 'amb',
  name: 'AirDAO'
};
const DEFAULT_ETH_NETWORK = {
  amb: '0x19caBC1E34Ab0CC5C62DaA1394f6022B38b75c78',
  id: 'eth',
  name: 'Ethereum',
  side: '0x0De2669e8A7A6F6CC0cBD3Cf2D1EEaD89e243208'
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
      symbol: 'AMB'
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
  const [chosenNetworks, setChosenNetworks] = useState<RenderTokenItem[]>();

  const parsedBridges = Object.keys(Config.BRIDGE_CONFIG.bridges).map(
    (item) => ({
      // @ts-ignore
      ...Config.BRIDGE_CONFIG.bridges[item],
      id: item,
      name: getNetworkNames(item)
    })
  );
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
      value: chosenNetworks,
      setter: setChosenNetworks
    },
    tokenParams: {
      value: selectedToken,
      setter: setSelectedToken
    },
    bridges,
    setSelectedAccount,
    selectedAccount
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextSelector = () => useBridgeContext((v) => v);
