import { createContextSelector } from '@utils/createContextSelector';
import { useEffect, useMemo, useState } from 'react';
import {
  Config as BridgeConfigModel,
  FeeData
} from '@lib/bridgeSDK/models/types';
import { getBridgePairs } from '@lib';
import {
  DEFAULT_AMB_NETWORK,
  DEFAULT_ETH_NETWORK,
  DEFAULT_TOKEN_FROM,
  DEFAULT_TOKEN_TO
} from '@features/bridge/constants';
import { useWallet } from '@hooks';
import { getBridgeConfig } from '@features/bridge/context/helpers';
import { parsedBridges } from '@features/bridge/context/helpers/parseBridges';
import {
  BridgeSelectorTypes,
  ParsedBridge,
  PreviewDataWithFeeModel
} from '@models/Bridge';
import { CryptoCurrencyCode } from '@appTypes';
import Config from '@constants/config';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';
import { BridgeTransactionHistoryDTO } from '@models/dtos/Bridge';

const EMPTY_FEE_DATA = [
  {
    value: {
      feeData: {},
      gasFee: BigNumber.from(0)
    },
    dataToPreview: []
  }
];

export const BridgeContext = () => {
  const { wallet: selectedWallet } = useWallet();
  const [bridgeDataLoader, setBridgeDataLoader] = useState(false);
  const [templateDataLoader, setTemplateDataLoader] = useState(false);
  const [bridgeConfig, setBridgeConfig] = useState<BridgeConfigModel | null>(
    null
  );

  const [from, setFrom] = useState(DEFAULT_AMB_NETWORK);
  const [destination, setDestination] = useState(DEFAULT_ETH_NETWORK);
  const networkNativeToken = Config.NETWORK_NATIVE_COIN[from.id];

  const [selectedBridgeData, setSelectedBridgeData] = useState(null);
  const [selectedTokenPairs, setSelectedTokenPairs] = useState(null);
  const [bridges, setBridges] = useState(null);

  const [amountToBridge, setAmountToBridge] = useState<string>('');

  const [bridgePreviewData, setBridgePreviewData] =
    // @ts-ignore
    useState<PreviewDataWithFeeModel>(EMPTY_FEE_DATA);

  const [processingTransaction, setProcessingTransaction] =
    useState<BridgeTransactionHistoryDTO | null>(null);

  const networkDataSetter = async (_bridgeConfig = bridgeConfig) => {
    try {
      if (_bridgeConfig) {
        setTemplateDataLoader(true);
        const pair = await getBridgePairs({
          from: from.id,
          destination: destination.id,
          bridgeConfig: _bridgeConfig,
          ownerAddress: selectedWallet?.address || ''
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
      alert(`DATA BRIDLE LOADING ERROR  ${JSON.stringify(e)}`);
    } finally {
      setBridgeDataLoader(false);
    }
  };

  const networkSetter = (type: BridgeSelectorTypes, item: ParsedBridge) => {
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
  };

  const fromData = {
    value: from,
    setter: networkSetter
  };
  const destinationData = {
    value: destination,
    setter: networkSetter
  };

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
  const processBridge = async (getOnlyGasFee: boolean, bridgeFee: FeeData) => {
    try {
      if (bridgeFee && selectedWallet?.address) {
        const withdrawData = {
          tokenFrom: selectedTokenFrom,
          tokenTo: selectedTokenDestination,
          selectedAccount: selectedWallet,
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
      // TODO remove IT after testing
      alert(`processBridge ERROR ${JSON.stringify(e)}`);
    }
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
    processingTransaction
  };
  const methods = {
    loadAllBridgeData,
    setBridgeDataLoader,
    setTemplateDataLoader,
    setAmountToBridge,
    setSelectedTokenPairs,
    setBridgePreviewData,
    processBridge,
    setProcessingTransaction
  };

  return {
    methods,
    variables
  };
};

export const [BridgeContextProvider, useBridgeContext] =
  createContextSelector(BridgeContext);
export const useBridgeContextData = () => useBridgeContext((v) => v);
