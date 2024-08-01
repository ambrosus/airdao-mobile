import { LayoutChangeEvent } from 'react-native';
import { RefObject, useMemo, useState } from 'react';
import { styles as bridgeFormStyle } from '../../templates/BridgeForm/styles';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { BridgeFeeModel, RenderTokenItem } from '@models/Bridge';
import { CurrencyUtils } from '@utils/currency';
import { StringUtils } from '@utils/string';
import { useBridgeContextData } from '@features/bridge/context';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { currentProvider, getBridgeFeeData } from '@lib';
import { DECIMAL_LIMIT } from '@constants/variables';
import { useCurrencyRate } from '@hooks';
import { BigNumber } from 'ethers';
import { DEFAULT_TOKEN_FROM, DEFAULT_TOKEN_TO } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';
import { HomeNavigationProp } from '@appTypes';
import { API } from '@api/api';
import { BridgeTransactionDTO } from '@models/dtos/Bridge';
import { parseBridgeTransaction } from '@lib/bridgeSDK/bridgeFunctions/parseBridgeTransaction';
import Config from '@constants/config';

interface UseBridgeNetworksDataModel {
  choseTokenRef?: RefObject<BottomSheetRef>;
  previewRef?: RefObject<BottomSheetRef>;
  transactionInfoRef?: RefObject<BottomSheetRef>;
}

const DEFAULT_BRIDGE_TRANSACTION = {
  loading: true,
  denominatedAmount: '',
  decimalAmount: '0x0',
  eventId: 0,
  networkFrom: 'amb',
  networkTo: 'eth',
  tokenFrom: DEFAULT_TOKEN_FROM,
  tokenTo: DEFAULT_TOKEN_TO,
  withdrawTx: '',
  userTo: '',
  amount: 0,
  fee: '',
  timestampStart: 0,
  transferFinishTxHash: ''
};

const INPUT_ERROR_TYPES = {
  INSUFFICIENT_FUNDS: 'insufficientFund',
  LESS_THEN_FEE: 'amountLessThenFee',
  INSUFFICIENT_FUNDS_TO_PROCESS: 'insufficientFundToProcessTransaction',
  NO_ERROR: null
};

export const useBridgeNetworksData = ({
  choseTokenRef,
  previewRef,
  transactionInfoRef
}: UseBridgeNetworksDataModel) => {
  const { t } = useTranslation();

  const navigation = useNavigation<HomeNavigationProp>();

  const [feeLoader, setFeeLoader] = useState(false);
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [isMax, setMax] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState('');
  const [bridgeFee, setBridgeFee] = useState<BridgeFeeModel | null>(null);
  const [gasFee, setGasFee] = useState<BigNumber>(BigNumber.from(0));
  const [gasFeeLoader, setGasFeeLoader] = useState(false);
  const [bridgeTransaction, setBridgeTransaction] =
    // @ts-ignore
    useState<BridgeTransactionDTO>(DEFAULT_BRIDGE_TRANSACTION);
  const [inputErrorType, setInputErrorType] = useState<string | null>(
    INPUT_ERROR_TYPES.NO_ERROR
  );
  const {
    selectedAccount,
    toParams,
    fromParams,
    tokenParams,
    bridgeConfig,
    selectedTokenDecimals
  } = useBridgeContextData();

  const errorMessage = useMemo(() => {
    switch (inputErrorType) {
      case 'amountLessThenFee':
        return t('bridge.amount.less.then.fee');
      case 'insufficientFundToProcessTransaction':
        return t('bridge.insufficient.funds.to.pay.fee');
      default:
        return '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputErrorType]);

  const networkNativeToken = Config.NETWORK_NATIVE_COIN[fromParams.value.id];

  const selectedToken = tokenParams.value;

  const currentTokenRate = useCurrencyRate(
    selectedToken.renderTokenItem.symbol
  );

  const selectedTokenFrom = selectedToken.pairs[0];
  const selectedTokenTo = selectedToken.pairs[1];

  const onCurrencySelectorLayoutHandle = (event: LayoutChangeEvent) => {
    setCurrencySelectorWidth(event.nativeEvent.layout.width);
  };

  const inputStyles = useMemo(() => {
    return {
      ...bridgeFormStyle.input,
      paddingLeft: currencySelectorWidth + 24
    };
  }, [currencySelectorWidth]);

  const onTokenPress = (item: RenderTokenItem) => {
    setMax(false);
    tokenParams.setter(item);
    setTimeout(() => choseTokenRef?.current?.dismiss(), 200);
  };
  const dataToPreview = (() => {
    const receiveCryptoData = NumberUtils.limitDecimalCount(
      formatUnits(bridgeFee?.amount || 0, selectedTokenDecimals),
      DECIMAL_LIMIT.CRYPTO
    );
    const receiveUSDData = NumberUtils.limitDecimalCount(
      CurrencyUtils.toUSD(+receiveCryptoData, currentTokenRate),
      DECIMAL_LIMIT.USD
    );

    return [
      {
        name: t('bridge.preview.receive'),
        crypto: {
          amount: bridgeFee?.amount ?? BigNumber.from(0),
          decimals: selectedTokenDecimals
        },
        usdAmount: receiveUSDData,
        symbol: selectedTokenFrom.symbol
      },
      {
        name: t('bridge.preview.bridge.fee'),
        crypto: {
          amount: bridgeFee?.bridgeAmount ?? BigNumber.from(0),
          decimals: networkNativeToken?.decimals || 18
        },
        usdAmount: null,
        symbol: bridgeFee?.feeToken.symbol
      },
      {
        name: t('bridge.preview.network.fee'),
        crypto: {
          amount: bridgeFee?.networkFee ?? BigNumber.from(0),
          decimals: networkNativeToken?.decimals || 18
        },
        usdAmount: null,
        symbol: bridgeFee?.feeToken.symbol
      },
      {
        name: t('bridge.preview.gas.fee'),
        crypto: {
          amount: gasFee,
          decimals: networkNativeToken?.decimals || 18
        },
        usdAmount: null,
        symbol: bridgeFee?.feeToken.symbol
      }
    ];
  })();

  const isAmountGraterThenBalance = ({
    balance,
    amount,
    token = selectedToken.renderTokenItem
  }: {
    balance: BigNumber;
    token?: RenderTokenItem;
    amount: string | BigNumber;
  }) => {
    const decimals = token.decimals ?? 18;
    if (!!+amount && !!balance) {
      const bigNumberAmount =
        typeof amount === 'string' ? parseUnits(amount, decimals) : amount;
      return bigNumberAmount.gt(balance);
    } else {
      return false;
    }
  };

  const onChangeAmount = (value: string) => {
    setMax(false);
    const finalValue = NumberUtils.limitDecimalCount(
      StringUtils.formatNumberInput(value),
      DECIMAL_LIMIT.CRYPTO
    );
    const selectedTokenBalance = tokenParams.value.renderTokenItem.balance;
    const isAmountGrater = isAmountGraterThenBalance({
      balance: selectedTokenBalance,
      amount: value
    });
    if (isAmountGrater) {
      setInputErrorType(INPUT_ERROR_TYPES.INSUFFICIENT_FUNDS);
    } else {
      setInputErrorType(INPUT_ERROR_TYPES.NO_ERROR);
    }

    setAmountToExchange(finalValue);
  };

  const errorHandler = (error: unknown) => {
    // @ts-ignore
    const errorMessage = `${error?.message}`;
    const amountLessThenFee =
      errorMessage.includes('error when getting fees: amount is too small') ||
      errorMessage.includes('amount to small');

    const insufficientFundToProcessTransaction =
      // @ts-ignore
      error?.code === 'INSUFFICIENT_FUNDS' &&
      // @ts-ignore
      error?.method === 'estimateGas' &&
      errorMessage.includes(
        'insufficient funds for intrinsic transaction cost'
      );

    switch (true) {
      case amountLessThenFee:
        setInputErrorType(INPUT_ERROR_TYPES.LESS_THEN_FEE);
        break;
      case insufficientFundToProcessTransaction:
        setInputErrorType(INPUT_ERROR_TYPES.INSUFFICIENT_FUNDS_TO_PROCESS);
        break;
      default:
        navigation.navigate('BridgeTransferError');
        break;
    }
  };

  const getFeeData = async (isMaxOptions = false) => {
    setFeeLoader(true);
    const tokenItem = selectedToken.renderTokenItem;

    // we need to subtract 1 from the balance to avoid inaccuracies in calculations about the maximum transfer amount
    const amountToSubtract = '1';
    const amountToFee = tokenItem.isNativeCoin
      ? tokenItem.balance.sub(parseUnits(amountToSubtract, tokenItem.decimals))
      : tokenItem.balance;

    const isAmountToFeeLessThenZero = !amountToFee.gt(0);
    const amountTokens = isMaxOptions
      ? formatUnits(amountToFee, tokenItem.decimals)
      : amountToExchange;
    const dataForFee = {
      tokenFrom: selectedToken.pairs[0],
      tokenTo: selectedToken.pairs[1],
      amountTokens,
      isMax: isMaxOptions ?? isMax
    };
    try {
      if (isAmountToFeeLessThenZero) {
        throw Error('amount to small');
      }

      const fee = await getBridgeFeeData({
        bridgeConfig,
        dataForFee
      });
      if (isMaxOptions) {
        setAmountToExchange(
          NumberUtils.limitDecimalCount(
            formatUnits(fee.amount, selectedTokenFrom.decimals),
            DECIMAL_LIMIT.CRYPTO
          )
        );
      }
      setBridgeFee({
        amount: fee.amount,
        feeToken: networkNativeToken,
        networkFee: fee.transferFee,
        bridgeAmount: fee.bridgeFee,
        feeData: fee
      });
    } catch (e) {
      errorHandler(e);
      // ignore
    } finally {
      setFeeLoader(false);
    }
  };
  const onSelectMaxAmount = () => {
    setInputErrorType(INPUT_ERROR_TYPES.NO_ERROR);
    if (selectedToken.renderTokenItem.isNativeCoin) {
      setMax(true);
      getFeeData(true);
    } else {
      onChangeAmount(
        `${formatUnits(
          selectedToken.renderTokenItem.balance,
          selectedToken.renderTokenItem.decimals
        )}`
      );
    }
  };
  const withdraw = async (gasFee = false) => {
    try {
      if (bridgeFee?.feeData && selectedAccount?.address) {
        const withdrawData = {
          tokenFrom: selectedTokenFrom,
          tokenTo: selectedTokenTo,
          selectedAccount,
          amountTokens: formatUnits(bridgeFee.amount, selectedTokenDecimals),
          feeData: bridgeFee.feeData,
          gasFee
        };

        return await bridgeWithdraw({
          bridgeConfig,
          fromNetwork: fromParams.value.id,
          withdrawData
        });
      }
    } catch (e) {
      errorHandler(e);
      return e;
    }
  };

  const onPressPreview = async () => {
    try {
      setGasFeeLoader(true);
      const _gasEstimate = await withdraw(true);
      if (_gasEstimate._hex) {
        const provider = await currentProvider(fromParams.value.id);
        const gasPrice = await provider?.getGasPrice();
        setGasFee(_gasEstimate.mul(gasPrice));
        previewRef?.current?.show();
      }
    } catch (e) {
      // ignore
    } finally {
      setGasFeeLoader(false);
    }
  };

  const onWithdrawApprove = async () => {
    // @ts-ignore
    setBridgeTransaction(DEFAULT_BRIDGE_TRANSACTION);
    transactionInfoRef?.current?.show();
    try {
      const res = await withdraw();
      if (res) {
        const bridgeTx = await res.wait(res);
        if (bridgeTx) {
          const allBridgeTransaction = await API.bridgeService.getBridgeHistory(
            selectedAccount?.address || ''
          );
          const transactionFromALLTransaction = allBridgeTransaction.find(
            (trans) => trans.withdrawTx === bridgeTx.transactionHash
          );
          const withdrawTransaction = transactionFromALLTransaction || {
            ...DEFAULT_BRIDGE_TRANSACTION,
            eventId: 0,
            loading: false,
            networkFrom: fromParams.value.id || '',
            networkTo: toParams.value.id || '',
            tokenFrom: selectedToken.pairs[0],
            tokenTo: selectedToken.pairs[1],
            decimalAmount: amountToExchange,
            withdrawTx: bridgeTx.transactionHash
          };
          setBridgeTransaction(parseBridgeTransaction(withdrawTransaction));
          setAmountToExchange('');
          await tokenParams.update();
        }
      }
    } catch (e) {
      errorHandler(e);
      transactionInfoRef?.current?.dismiss();
    }
  };

  const variables = {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee,
    gasFeeLoader,
    bridgeTransaction,
    inputErrorType,
    errorMessage,
    isMax,
    INPUT_ERROR_TYPES
  };
  const methods = {
    getFeeData,
    onCurrencySelectorLayoutHandle,
    onSelectMaxAmount,
    onChangeAmount,
    onTokenPress,
    setFeeLoader,
    setBridgeFee,
    onPressPreview,
    onWithdrawApprove,
    isAmountGraterThenBalance,
    setAmountToExchange,
    setInputErrorType
  };
  return {
    variables,
    methods
  };
};
