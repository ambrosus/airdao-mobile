import { createContextSelector } from '@utils/createContextSelector';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Config as BridgeConfigModel,
  BridgeDataState,
  FeeData,
  Token
} from '@lib/bridgeSDK/models/types';
import { getBridgePairs } from '@lib';
import {
  BRIDGE_ERROR_CODES,
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK,
  DEFAULT_TOKEN_FROM,
  DEFAULT_TOKEN_TO,
  EMPTY_FEE_DATA,
  METHODS_FROM_ERRORS
} from '@features/bridge/constants';
import { getBridgeConfig } from '../utils';
import { parsedBridges } from '@features/bridge/utils/parseBridges';
import {
  BridgeSelectorTypes,
  ParsedBridge,
  PreviewDataWithFeeModel
} from '@models/Bridge';
import { CryptoCurrencyCode } from '@appTypes';
import Config from '@constants/config';
import { formatUnits } from 'ethers/lib/utils';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { useTranslation } from 'react-i18next';
import { Toast, ToastType } from '@components/modular';
import { useWalletStore } from '@entities/wallet';

export const BridgeContext = () => {
  const { t } = useTranslation();

  const { wallet } = useWalletStore();
  const [bridgeDataLoader, setBridgeDataLoader] = useState(false);
  const [templateDataLoader, setTemplateDataLoader] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfigModel | null>(
    null
  );

  const [from, setFrom] = useState(DEFAULT_AMB_NETWORK);
  const [destination, setDestination] = useState(DEFAULT_ETH_NETWORK);
  const networkNativeToken = Config.NETWORK_NATIVE_COIN[from.id];

  const [selectedBridgeData, setSelectedBridgeData] =
    useState<BridgeDataState | null>(null);
  const [selectedTokenPairs, setSelectedTokenPairs] = useState<Token[] | null>(
    null
  );
  const [bridges, setBridges] = useState(null);

  const [amountToBridge, setAmountToBridge] = useState<string>('');

  const [bridgePreviewData, setBridgePreviewData] =
    // @ts-ignore
    useState<PreviewDataWithFeeModel>(EMPTY_FEE_DATA);

  const [processingTransaction, setProcessingTransaction] =
    useState<BridgeTransactionHistoryDTO | null>(null);

  const bridgeErrorHandler = useCallback(
    (_error: unknown) => {
      // @ts-ignore
      const errorCode = _error.code;
      // @ts-ignore
      const errorMethods = _error.method;
      const type = ToastType.Failed;

      const insufficientFundsToPayFees =
        errorCode === BRIDGE_ERROR_CODES.INSUFFICIENT_FUNDS &&
        errorMethods === METHODS_FROM_ERRORS.ESTIMATE_GAS;

      switch (true) {
        case insufficientFundsToPayFees:
          return Toast.show({
            type,
            text: t('bridge.insufficient.funds.to.pay.fee.header').replace(
              '{{symbol}}',
              networkNativeToken.symbol || ''
            ),
            subtext: t(
              'bridge.insufficient.funds.to.pay.fee.subHeader'
            ).replace('{{symbol}}', networkNativeToken.symbol || '')
          });
        default:
          return Toast.show({
            type,
            text: t('bridge.unknown.error'),
            subtext: t('import.wallet.key.error.try.again')
          });
      }
    },
    [networkNativeToken.symbol, t]
  );

  const networkDataSetter = async (_bridgeConfig = bridgeConfig) => {
    try {
      if (_bridgeConfig) {
        setTemplateDataLoader(true);
        const pair = await getBridgePairs({
          from: from.id,
          destination: destination.id,
          bridgeConfig: _bridgeConfig,
          ownerAddress: wallet?.address || ''
        });
        // @ts-ignore
        setSelectedBridgeData(pair);
        const pairsToTokenByDefault = pair.pairs.find((item) => {
          if (pair.name === 'amb->eth') {
            return item.find((token) => token.isNativeCoin);
          } else {
            return item.find(
              (token) =>
                token.symbol === CryptoCurrencyCode.AMB ||
                token.symbol === CryptoCurrencyCode.SAMB
            );
          }
        });
        if (pairsToTokenByDefault) {
          // @ts-ignore
          setSelectedTokenPairs(pairsToTokenByDefault);
        }
      }
    } catch (e) {
      // TODO remove IT after testing
      alert(`networkDataSetterError ${JSON.stringify(e)}`);
    } finally {
      setTemplateDataLoader(false);
    }
  };

  useEffect(() => {
    const getPairs = async () => {
      await networkDataSetter();
    };
    getPairs().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from.id, destination.id]);

  const loadAllBridgeData = async () => {
    try {
      setBridgeDataLoader(true);
      const config = await getBridgeConfig();
      if (config) {
        setBridgeConfig(config);

        await networkDataSetter(config);

        const bridges = parsedBridges(config);
        // @ts-ignore
        setBridges(bridges);
      }
    } catch (e) {
      // TODO remove IT after testing
      bridgeErrorHandler(e);
      alert(`DATA BRIDLE LOADING ERROR  ${JSON.stringify(e)}`);
    } finally {
      setBridgeDataLoader(false);
    }
  };

  const networkSetter = useCallback(
    (type: BridgeSelectorTypes, item: ParsedBridge) => {
      const isFrom = type === 'from';
      const oppositeNetwork = isFrom ? destination : from;
      const oppositeSetter = isFrom ? setDestination : setFrom;
      const setter = isFrom ? setFrom : setDestination;

      setter(item);
      const isTheSameNetwork = item.id === oppositeNetwork.id;
      const isSelectedAMBNetwork = item.id === 'amb';

      if (isTheSameNetwork && !isSelectedAMBNetwork) {
        oppositeSetter(DEFAULT_AMB_NETWORK);
      }
      if (isTheSameNetwork && isSelectedAMBNetwork) {
        oppositeSetter(DEFAULT_ETH_NETWORK);
      }
      // if user not chose amb network
      if (oppositeNetwork.id !== 'amb' && !isSelectedAMBNetwork) {
        oppositeSetter(DEFAULT_AMB_NETWORK);
      }
    },
    [destination, from]
  );

  const fromData = useMemo(
    () => ({
      value: from,
      setter: networkSetter
    }),
    [from, networkSetter]
  );

  const destinationData = useMemo(
    () => ({
      value: destination,
      setter: networkSetter
    }),
    [destination, networkSetter]
  );

  const bridgeLoader = useMemo<boolean>(() => {
    return (
      bridgeDataLoader ||
      !bridgeConfig ||
      !selectedBridgeData ||
      !selectedTokenPairs
    );
  }, [bridgeConfig, bridgeDataLoader, selectedBridgeData, selectedTokenPairs]);

  const selectedTokenFrom = useMemo(() => {
    return selectedTokenPairs ? selectedTokenPairs[0] : DEFAULT_TOKEN_FROM;
  }, [selectedTokenPairs]);

  const selectedTokenDestination = useMemo(() => {
    return selectedTokenPairs ? selectedTokenPairs[1] : DEFAULT_TOKEN_TO;
  }, [selectedTokenPairs]);

  const processBridge = useCallback(
    async (getOnlyGasFee: boolean, bridgeFee: FeeData) => {
      try {
        if (bridgeFee && wallet?.address) {
          const withdrawData = {
            tokenFrom: selectedTokenFrom,
            tokenTo: selectedTokenDestination,
            selectedAccount: wallet,
            amountTokens: formatUnits(
              bridgeFee.amount,
              selectedTokenFrom.decimals
            ),
            feeData: bridgeFee,
            gasFee: getOnlyGasFee
          };
          if (bridgeConfig) {
            return await bridgeWithdraw({
              bridgeConfig,
              fromNetwork: fromData.value.id,
              withdrawData
            });
          }
        }
      } catch (e) {
        // ignore
        bridgeErrorHandler(e);
        alert(
          `${
            getOnlyGasFee ? 'getOnlyGasFee' : ''
          } processBridge ERROR ${JSON.stringify(e)}`
        );
      }
    },
    [
      bridgeConfig,
      bridgeErrorHandler,
      fromData.value.id,
      selectedTokenDestination,
      selectedTokenFrom,
      wallet
    ]
  );

  const variables = {
    bridgeLoader,
    bridgeConfig,
    bridges,
    fromData,
    destinationData,
    templateDataLoader,
    selectedTokenPairs,
    selectedBridgeData,
    amountToBridge,
    networkNativeToken,
    selectedTokenFrom,
    selectedTokenDestination,
    bridgePreviewData,
    processingTransaction,
    processBridge,

    bridgeErrorHandler
  };

  const methods = {
    loadAllBridgeData,
    setBridgeDataLoader,
    setTemplateDataLoader,
    setAmountToBridge,
    setSelectedTokenPairs,
    setBridgePreviewData,
    setProcessingTransaction,
    setSelectedBridgeData
  };

  return {
    methods,
    variables
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextData = () => useBridgeContext((v) => v);
