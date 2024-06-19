import { LayoutChangeEvent } from 'react-native';
import { RefObject, useMemo, useState } from 'react';
import { styles as bridgeFormStyle } from '@components/templates/Bridge/BridgeForm/styles';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { BridgeFeeModel, RenderTokenItem } from '@models/Bridge';
import { CurrencyUtils } from '@utils/currency';
import { StringUtils } from '@utils/string';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useTranslation } from 'react-i18next';
import { BottomSheetRef } from '@components/composite';
import { currentProvider, getBridgeFeeData, getBridgeTransactions } from '@lib';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';
import { DECIMAL_LIMIT } from '@constants/variables';
import { useCurrencyRate } from '@hooks';

interface UseBridgeNetworksDataModel {
  choseTokenRef: RefObject<BottomSheetRef>;
  previewRef: RefObject<BottomSheetRef>;
  transactionInfoRef: RefObject<BottomSheetRef>;
}

const DEFAULT_BRIDGE_TRANSACTION = {
  denominatedAmount: '0x0',
  loading: true,
  withdrawTx: ''
};
const DEFAULT_BRIDGE_TRANSFER = { hash: '' };

export const useBridgeNetworksData = ({
  choseTokenRef,
  previewRef,
  transactionInfoRef
}: UseBridgeNetworksDataModel) => {
  const [feeLoader, setFeeLoader] = useState(false);
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [isMax, setMax] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState('');
  const [bridgeFee, setBridgeFee] = useState<BridgeFeeModel | null>(null);
  const [gasFee, setGasFee] = useState<string | number>(0);
  const [gasFeeLoader, setGasFeeLoader] = useState(false);
  const [bridgeTransfer, setBridgeTransfer] = useState(DEFAULT_BRIDGE_TRANSFER);
  const [bridgeTransaction, setBridgeTransaction] = useState<{
    denominatedAmount: string | number;
    loading?: boolean;
    withdrawTx: string;
  }>(DEFAULT_BRIDGE_TRANSACTION);
  const [inputError, setInputError] = useState(false);
  const {
    selectedAccount,
    networkNativeCoin,
    toParams,
    fromParams,
    tokenParams,
    bridgeConfig
  } = useBridgeContextSelector();

  const currentTokenRate = useCurrencyRate(
    tokenParams.value.renderTokenItem.symbol
  );

  const selectedTokenFrom = tokenParams.value.pairs[0];
  const selectedTokenTo = tokenParams.value.pairs[1];

  const { t } = useTranslation();

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
      bridgeFee?.amount ?? '0',
      DECIMAL_LIMIT.CRYPTO
    );
    const receiveUSDData = NumberUtils.limitDecimalCount(
      CurrencyUtils.toUSD(+receiveCryptoData, currentTokenRate),
      DECIMAL_LIMIT.USD
    );
    const bridgeFeeAmount = bridgeFee?.bridgeAmount;
    const networkFee = bridgeFee?.networkFee;
    // symbol destination = 0 -> from || 1 -> to
    const symbol = (destination: number) =>
      tokenParams.value.pairs[destination].symbol;
    return [
      {
        name: t('bridge.preview.receive'),
        cryptoAmount: receiveCryptoData,
        usdAmount: receiveUSDData,
        symbol: symbol(1)
      },
      {
        name: t('bridge.preview.bridge.fee'),
        cryptoAmount: bridgeFeeAmount,
        symbol: bridgeFee?.feeSymbol
      },
      {
        name: t('bridge.preview.network.fee'),
        cryptoAmount: networkFee,
        symbol: bridgeFee?.feeSymbol
      },
      {
        name: t('bridge.preview.gas.fee'),
        cryptoAmount: gasFee,
        symbol: bridgeFee?.feeSymbol
      }
    ];
  })();

  const validateBalance = ({
    balance,
    amount
  }: {
    balance: string | number;
    amount: string | number;
  }) => {
    const _balance = +balance;
    const _amount = +amount;
    if (_amount) {
      const result = _balance >= _amount;

      if (result) {
        setInputError(false);
        return true;
      } else {
        setInputError(true);
        return false;
      }
    } else {
      setInputError(false);
    }
  };

  const onChangeAmount = (value: string) => {
    setMax(false);
    const finalValue = NumberUtils.limitDecimalCount(
      StringUtils.formatNumberInput(value),
      DECIMAL_LIMIT.CRYPTO
    );
    setAmountToExchange(finalValue);
  };

  const getFeeData = async (isMaxOptions = false) => {
    setFeeLoader(true);
    const amountTokens = isMaxOptions
      ? tokenParams.value.renderTokenItem.balance
      : amountToExchange;
    const dataForFee = {
      tokenFrom: tokenParams.value.pairs[0],
      tokenTo: tokenParams.value.pairs[1],
      amountTokens,
      isMax: isMaxOptions ?? isMax
    };
    try {
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
      const tokenDecimals =
        selectedTokenFrom.network === 'amb'
          ? selectedTokenTo.decimals
          : selectedTokenFrom.decimals;
      setBridgeFee({
        amount: formatUnits(fee.amount, tokenDecimals),

        feeSymbol: networkNativeCoin?.symbol || '',
        networkFee: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.transferFee)),
          DECIMAL_LIMIT.CRYPTO
        ),
        bridgeAmount: NumberUtils.limitDecimalCount(
          Number(formatUnits(fee.bridgeFee, selectedTokenTo.decimals)),
          DECIMAL_LIMIT.CRYPTO
        ),
        feeData: fee
      });
    } catch (e) {
      // console.log('FEE ERROR', e);
      // ignore
    } finally {
      setFeeLoader(false);
    }
  };
  const onSelectMaxAmount = () => {
    if (tokenParams.value.renderTokenItem.isNativeCoin) {
      setMax(true);
      getFeeData(true);
    } else {
      onChangeAmount(`${tokenParams.value.renderTokenItem.balance}`);
    }
  };
  const withdraw = async (gasFee = false) => {
    try {
      if (bridgeFee?.feeData && selectedAccount?.address) {
        const withdrawData = {
          tokenFrom: selectedTokenFrom,
          tokenTo: selectedTokenTo,
          selectedAccount,
          amountTokens: amountToExchange,
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
      // console.log('GENERAL withdraw', e);
      // ignore;
    }
  };

  const onPressPreview = async () => {
    try {
      setInputError(false);
      setGasFeeLoader(true);

      const _gasEstimate = await withdraw(true);
      if (_gasEstimate._hex) {
        const provider = await currentProvider(fromParams.value.id);
        const gasPrice = await provider?.getGasPrice();

        setGasFee(
          NumberUtils.limitDecimalCount(
            formatEther(_gasEstimate.mul(gasPrice)),
            DECIMAL_LIMIT.CRYPTO
          )
        );
      }
      previewRef?.current?.show();
    } catch (e) {
      // console.log('GAS_ESTIMATE', e);
      // ignore
    } finally {
      setGasFeeLoader(false);
    }
  };

  const onWithdrawApprove = async () => {
    setBridgeTransaction(DEFAULT_BRIDGE_TRANSACTION);
    setBridgeTransfer(DEFAULT_BRIDGE_TRANSFER);
    transactionInfoRef.current?.show();
    try {
      const res = await withdraw();
      if (res) {
        const bridgeTx = await res.wait(res);
        if (bridgeTx) {
          const allBridgeTransaction = await getBridgeTransactions(
            selectedAccount?.address
          );
          const withdrawTransaction = allBridgeTransaction.find(
            (trans) => trans.withdrawTx === bridgeTx.transactionHash
          ) || {
            eventId: '',
            networkFrom: fromParams.value.id || '',
            networkTo: toParams.value.id || '',
            tokenFrom: tokenParams.value.pairs[0],
            tokenTo: tokenParams.value.pairs[1],
            denominatedAmount: amountToExchange,
            withdrawTx: bridgeTx.transactionHash
          };
          setBridgeTransaction(withdrawTransaction);
          await tokenParams.update();
        }
      }
    } catch (e) {
      transactionInfoRef.current?.dismiss();
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
    bridgeTransfer,
    inputError,
    isMax
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
    validateBalance
  };
  return {
    variables,
    methods
  };
};
