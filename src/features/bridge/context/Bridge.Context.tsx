import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Toast, ToastType } from '@components/modular';
import Config from '@constants/config';
import { useWalletStore } from '@entities/wallet';
import {
  BRIDGE_ERROR_CODES,
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK,
  DEFAULT_TOKEN_FROM,
  DEFAULT_TOKEN_TO,
  EMPTY_FEE_DATA,
  METHODS_FROM_ERRORS
} from '@features/bridge/constants';
import { parsedBridges } from '@features/bridge/utils/parseBridges';
import { getBridgePairs } from '@lib';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/bridgeWithdraw';
import {
  BridgeDataState,
  Config as BridgeConfigModel,
  FeeData,
  Token
} from '@lib/bridgeSDK/models/types';

import {
  CustomAppEvents,
  sendFirebaseEvent
} from '@lib/firebaseEventAnalytics';
import { TransactionDTO } from '@models';
import {
  BridgeSelectorTypes,
  ParsedBridge,
  PreviewDataWithFeeModel,
  TransactionOnLoopModel
} from '@models/Bridge';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';
import { createContextSelector } from '@utils';
import { getBridgeConfig } from '../utils';

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
  const [transactionsOnLoop, setTransactionsOnLoop] = useState<
    TransactionOnLoopModel[]
  >([]);

  const bridgeErrorHandler = useCallback(
    (_error: unknown) => {
      const errorCode = (_error as { code?: string | number }).code;
      const errorMessage =
        (_error as { message?: string }).message || JSON.stringify(_error);
      const errorMethods = (_error as { method?: string }).method;
      const type = ToastType.Failed;

      const errors = {
        insufficientFundsToPayFees:
          errorCode === BRIDGE_ERROR_CODES.INSUFFICIENT_FUNDS &&
          errorMethods === METHODS_FROM_ERRORS.ESTIMATE_GAS,

        isAmountTooSmall: errorMessage.includes(
          BRIDGE_ERROR_CODES.AMOUNT_TO_SMALL
        ),

        isInsufficientFunds:
          errorMessage.includes(BRIDGE_ERROR_CODES.INSUFFICIENT_FUNDS_3) ||
          errorCode === -32010,

        isTransactionPending: errorMessage.includes(
          BRIDGE_ERROR_CODES.TRANSACTION_ON_PROCESS
        )
      };

      sendFirebaseEvent(CustomAppEvents.bridge_error, {
        bridgeError: errorMessage
      });

      switch (true) {
        case errors.insufficientFundsToPayFees:
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
        case errors.isInsufficientFunds:
        case errors.isAmountTooSmall:
          return Toast.show({
            type,
            text: t('bridge.insufficient.funds'),
            subtext: t('bridge.insufficient.funds.description')
          });
        case errors.isTransactionPending:
          return Toast.show({
            type: ToastType.Information,
            text: t('bridge.some.transaction.on.progress.text'),
            subtext: t('bridge.some.transaction.on.progress.message')
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
      bridgeErrorHandler(e);
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

  const decimals = useMemo(
    () =>
      fromData.value.id === 'amb'
        ? selectedTokenDestination.decimals
        : selectedTokenFrom.decimals,
    [
      fromData.value.id,
      selectedTokenDestination.decimals,
      selectedTokenFrom.decimals
    ]
  );

  const processBridge = useCallback(
    async (bridgeFee: FeeData) => {
      try {
        if (bridgeFee && wallet?.address) {
          const withdrawData = {
            tokenFrom: selectedTokenFrom,
            tokenTo: selectedTokenDestination,
            selectedAccount: wallet,
            amountTokens: formatUnits(bridgeFee.amount, decimals),
            feeData: bridgeFee
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
        throw e;
        // ignore
      }
    },
    [
      bridgeConfig,
      decimals,
      fromData.value.id,
      selectedTokenDestination,
      selectedTokenFrom,
      wallet
    ]
  );

  const getTransactionTransaction = async (
    _transaction: BridgeTransactionHistoryDTO
  ) => {
    const doneTransaction: TransactionDTO = await _transaction.wait();
    setTransactionsOnLoop((prevState) =>
      prevState.filter(
        (transaction) => transaction.address !== doneTransaction.from
      )
    );

    return doneTransaction;
  };

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
    transactionsOnLoop
  };

  const methods = {
    loadAllBridgeData,
    setBridgeDataLoader,
    setTemplateDataLoader,
    setAmountToBridge,
    setSelectedTokenPairs,
    setBridgePreviewData,
    setProcessingTransaction,
    setSelectedBridgeData,
    setFrom,
    getTransactionTransaction,
    setTransactionsOnLoop,
    bridgeErrorHandler
  };

  return {
    methods,
    variables
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextData = () => useBridgeContext((v) => v);
