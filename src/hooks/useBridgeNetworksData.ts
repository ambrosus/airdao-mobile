import { LayoutChangeEvent } from 'react-native';
import { RefObject, useMemo, useState } from 'react';
import { styles } from '@components/modular/Bridge/BridgeForm/styles';
import { formatEther } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { RenderTokenItem } from '@models/Bridge';
import { CurrencyUtils } from '@utils/currency';
import { StringUtils } from '@utils/string';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useTranslation } from 'react-i18next';
import { BridgeFeeModel } from '@components/modular/Bridge/BridgeForm/BridgeForm';
import { BottomSheetRef } from '@components/composite';
import { currentProvider, getBridgeFeeData } from '@lib';
import { bridgeWithdraw } from '@lib/bridgeSDK/bridgeFunctions/calculateGazFee';

interface UseBridgeNetworksDataModel {
  choseTokenRef: RefObject<BottomSheetRef>;
  previewRef: RefObject<BottomSheetRef>;
  transactionInfoRef: RefObject<BottomSheetRef>;
}

const DECIMAL_CRYPTO_LIMIT = 5;
const DECIMAL_USD_LIMIT = 2;
const DEFAULT_BRIDGE_TRANSACTION = {
  amount: '0x0',
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
    amount: string;
    loading?: boolean;
    withdrawTx: string;
  }>(DEFAULT_BRIDGE_TRANSACTION);

  const {
    selectedAccount,
    networkNativeCoin,
    toParams,
    fromParams,
    tokenParams,
    bridgeConfig
  } = useBridgeContextSelector();
  const { t } = useTranslation();

  const onCurrencySelectorLayoutHandle = (event: LayoutChangeEvent) => {
    setCurrencySelectorWidth(event.nativeEvent.layout.width);
  };

  const inputStyles = useMemo(() => {
    return {
      ...styles.input,
      paddingLeft: currencySelectorWidth + 24
    };
  }, [currencySelectorWidth]);

  const onSelectMaxAmount = () => {
    setAmountToExchange(`${tokenParams.value.renderTokenItem.balance}`);

    if (tokenParams.value.renderTokenItem.isNativeCoin) {
      setMax(true);
    }
  };

  // @ts-ignore

  const getFeeData = async () => {
    // TODO Handle situation when user has less then fee
    const dataForFee = {
      tokenFrom: tokenParams.value.pairs[0],
      tokenTo: tokenParams.value.pairs[1],
      amountTokens: amountToExchange,
      isMax
    };
    try {
      const fee = await getBridgeFeeData({
        bridgeConfig,
        dataForFee
      });
      setBridgeFee({
        amount: formatEther(fee.amount._hex),
        feeSymbol: networkNativeCoin?.symbol || '',
        networkFee: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.transferFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        ),
        bridgeAmount: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.bridgeFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        ),
        feeData: fee
      });
    } catch (e) {
      // ignore
    } finally {
      setFeeLoader(false);
    }
  };

  const onTokenPress = (item: RenderTokenItem) => {
    if (!item.renderTokenItem.isNativeCoin) {
      setMax(false);
    }
    tokenParams.setter(item);
    setTimeout(() => choseTokenRef?.current?.dismiss(), 200);
  };
  const dataToPreview = (() => {
    const receiveDataUSD = NumberUtils.limitDecimalCount(
      CurrencyUtils.toUSD(+amountToExchange, 0.2),
      DECIMAL_USD_LIMIT
    );
    const bridgeFeeAmount = bridgeFee?.bridgeAmount;
    const networkFee = bridgeFee?.networkFee;
    // symbol destination = 0 -> from || 1 -> to
    const symbol = (destination: number) =>
      tokenParams.value.pairs[destination].symbol;
    return [
      {
        name: t('bridge.preview.receive'),
        cryptoAmount: amountToExchange,
        usdAmount: receiveDataUSD,
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
  const onChangeAmount = (value: string) => {
    setMax(false);
    let finalValue = StringUtils.formatNumberInput(value);
    finalValue = NumberUtils.limitDecimalCount(
      finalValue,
      DECIMAL_CRYPTO_LIMIT
    );
    setAmountToExchange(finalValue);
  };

  const withdraw = async (gasFee = false) => {
    try {
      if (bridgeFee?.feeData && selectedAccount?.address) {
        const withdrawData = {
          tokenFrom: tokenParams.value.pairs[0],
          tokenTo: tokenParams.value.pairs[1],
          selectedAccount,
          amountTokens: amountToExchange,
          feeData: bridgeFee.feeData,
          gasFee
        };

        return await bridgeWithdraw({
          bridgeConfig,
          from: fromParams.value.id,
          withdrawData
        });
      }
    } catch (e) {
      // console.log('WITHDRAW ERROR', e);
      // ignore;
    }
  };

  const onPressPreview = async () => {
    try {
      setGasFeeLoader(true);

      const _gasEstimate = await withdraw(true);
      if (_gasEstimate._hex) {
        const provider = await currentProvider(fromParams.value.id);
        const gasPrice = await provider?.getGasPrice();

        setGasFee(
          NumberUtils.limitDecimalCount(
            formatEther(_gasEstimate.mul(gasPrice)),
            DECIMAL_CRYPTO_LIMIT
          )
        );
      }
      previewRef?.current?.show();
    } catch (e) {
      // console.log('IN ERROR bridge.estimateGas.wrapWithdraw->', e);
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
          const bridgeTransaction = {
            eventId: '',
            networkFrom: fromParams.value.id || '',
            networkTo: toParams.value.id || '',
            tokenFrom: tokenParams.value.pairs[0],
            tokenTo: tokenParams.value.pairs[1],
            amount: res.value._hex || '0x0',
            withdrawTx: bridgeTx.transactionHash
          };
          setBridgeTransaction(bridgeTransaction);
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
    bridgeTransfer
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
    onWithdrawApprove
  };
  return {
    variables,
    methods
  };
};
