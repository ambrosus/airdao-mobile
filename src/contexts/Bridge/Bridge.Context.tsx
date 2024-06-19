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
import { getBridgeBalance, getBridgePairs } from '@lib';
import { NumberUtils } from '@utils/number';
import { formatUnits } from 'ethers/lib/utils';
import { parseNetworkParams } from '@hooks/bridge/services';
import { CryptoCurrencyCode } from '@appTypes';
import { DECIMAL_LIMIT } from '@constants/variables';

export const BridgeContext = () => {
  const [config, setConfig] = useState<any>({});
  const [selectedToken, setSelectedToken] =
    // @ts-ignore
    useState<RenderTokenItem>(DEFAULT_TOKEN_PAIRS);
  const [from, setFrom] = useState(DEFAULT_AMB_NETWORK);
  const [to, setTo] = useState(DEFAULT_ETH_NETWORK);
  const [tokensForSelector, setTokensForSelector] =
    useState<RenderTokenItem[]>();

  const [tokenDataLoader, setTokenDataLoader] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountDBModel | null>(
    null
  );

  const setSelectedTokenData = async (
    pairs: RenderTokenItem = selectedToken
  ) => {
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

      const { USDC, USDT, BUSD } = CryptoCurrencyCode;

      const symbol = pairs.renderTokenItem.symbol;
      const isUSDToken = symbol === USDC || symbol === USDT || symbol === BUSD;

      tokenData.renderTokenItem.balance =
        NumberUtils.limitDecimalCount(
          formatUnits(balance, pairs.renderTokenItem.decimals),
          isUSDToken ? DECIMAL_LIMIT.USD : DECIMAL_LIMIT.CRYPTO
        ) || '';
      setSelectedToken(tokenData);
      return balance;
    } catch (e) {
      // ignore
    } finally {
      setTokenDataLoader(false);
    }
  };

  const setAllRequireBridgeData = () => {
    getBridgePairs({
      from: from.id,
      to: to.id,
      bridgeConfig: config
    }).then((r) => {
      return parseNetworkParams(
        r,
        setTokensForSelector,
        setSelectedTokenData,
        from.id
      );
    });
  };

  const setDefaultBridgeData = () => {
    setFrom(DEFAULT_AMB_NETWORK);
    setTo(DEFAULT_ETH_NETWORK);
    // @ts-ignore
    setSelectedToken(DEFAULT_TOKEN_PAIRS);
    setAllRequireBridgeData();
  };

  useEffect(() => {
    setAllRequireBridgeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.id, from.id]);

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
    tokenParams: {
      value: selectedToken,
      setter: setSelectedTokenData,
      update: setSelectedTokenData,
      loader: tokenDataLoader
    },
    fromParams: {
      value: from,
      setter: fromSetter
    },
    toParams: {
      value: to,
      setter: toSetter
    },
    networksParams: tokensForSelector,
    bridgeConfig: config,
    setDefaultBridgeData,
    setSelectedAccount,
    networkNativeCoin,
    selectedAccount,
    bridges
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextSelector = () => useBridgeContext((v) => v);
