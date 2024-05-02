import { createContextSelector } from '@utils/createContextSelector';
import { useState } from 'react';
import { ParsedBridge } from '@models/Bridge';
import Config from '@constants/config';

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

const DEFAULT_CHOSEN_NETWORKS = {
  name: '',
  pairs: []
};

type SelectedAccountKeyState = 'hash' | 'address';

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
  const [selectedAccount, setSelectedAccount] = useState<
    Record<SelectedAccountKeyState, string>
  >({
    hash: '',
    address: ''
  });

  const [from, setFrom] = useState(DEFAULT_AMB_NETWORK);
  const [to, setTo] = useState(DEFAULT_ETH_NETWORK);
  const [chosenNetworks, setChosenNetworks] = useState(DEFAULT_CHOSEN_NETWORKS);

  const parsedBridges = Object.keys(Config.BRIDGE_CONFIG).map((item) => ({
    // @ts-ignore
    ...Config.BRIDGE_CONFIG.bridges[item],
    id: item,
    name: getNetworkNames(item)
  }));
  const bridges: ParsedBridge[] = [...parsedBridges, DEFAULT_AMB_NETWORK];

  // const parseTokens = () => {
  //   chosenNetworks.pairs.map((item) => console.log('tt', item));
  // };

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

  // useEffect(() => {
  //   console.log('EFFECT');
  //   if (chosenNetworks.pairs.length) {
  //     console.log('EFFECT IN IF ->>');
  //
  //     parseTokens();
  //   }
  // }, [chosenNetworks.pairs]);
  //
  // console.log(chosenNetworks, 'chosenNetworks');
  //
  return {
    bridges,
    fromParams: {
      value: from,
      setter: fromSetter
    },
    toParams: {
      value: to,
      setter: toSetter
    },
    tokenParams: {
      value: chosenNetworks,
      setter: setChosenNetworks
    },
    setSelectedAccount,
    selectedAccount
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextSelector = () => useBridgeContext((v) => v);
