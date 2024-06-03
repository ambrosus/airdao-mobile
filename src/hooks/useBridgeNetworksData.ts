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
import {
  bridgeWithdraw,
  currentProvider,
  getBridgeBalance,
  getBridgeFeeData
} from '@lib';

interface UseBridgeNetworksDataModel {
  choseTokenRef: RefObject<BottomSheetRef>;
  previewRef: RefObject<BottomSheetRef>;
}

const DECIMAL_CRYPTO_LIMIT = 5;
const DECIMAL_USD_LIMIT = 2;

export const useBridgeNetworksData = ({
  choseTokenRef,
  previewRef
}: UseBridgeNetworksDataModel) => {
  const [feeLoader, setFeeLoader] = useState(false);
  const [balanceLoader, setBalanceLoader] = useState(false);
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [isMax, setMax] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState('');
  const [bridgeFee, setBridgeFee] = useState<BridgeFeeModel | null>(null);
  const [selectedTokenBalance, setSelectedTokenBalance] = useState('');
  const [gasFee, setGasFee] = useState(0);
  const [gasFeeLoader, setGasFeeLoader] = useState(false);

  const { selectedAccount, networkNativeCoin } = useBridgeContextSelector();
  const { t } = useTranslation();
  const { tokenParams, bridgeConfig, fromParams } = useBridgeContextSelector();

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
    setAmountToExchange('999');

    if (tokenParams.value.renderTokenItem.isNativeCoin) {
      setMax(true);
    }
  };

  const getSelectedTokenBalance = async (token) => {
    try {
      setBalanceLoader(true);
      const balance = await getBridgeBalance({
        from: fromParams.value.id,
        token,
        ownerAddress: selectedAccount?.address || ''
      });
      // console.log('balanceParams', {
      //   from: fromParams.value.id,
      //   token,
      //   ownerAddress: selectedAccount?.address || ''
      // });
      setSelectedTokenBalance(
        NumberUtils.limitDecimalCount(formatEther(balance?._hex), 2) || ''
      );
      return balance;
    } catch (e) {
      // ignore
    } finally {
      setBalanceLoader(false);
    }
  };

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
        // console.log('withdrawData', withdrawData);
        return await bridgeWithdraw({
          bridgeConfig,
          from: fromParams.value.id,
          withdrawData
        });
      }
    } catch (e) {
      // console.log('WITHDRAW ERROR', e);
      // ignore
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
          CurrencyUtils.toUSD(
            Number(formatEther(gasPrice?._hex || '0x00')),
            Number(formatEther(_gasEstimate?._hex))
          )
        );
      }
      previewRef?.current?.show();
    } catch (e) {
      // console.log('IN ERROR bridge.estimateGas.wrapWithdraw->', e);
    } finally {
      setGasFeeLoader(false);
    }
  };

  const variables = {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee,
    selectedTokenBalance,
    balanceLoader,
    gasFeeLoader
  };
  const methods = {
    getFeeData,
    onCurrencySelectorLayoutHandle,
    onSelectMaxAmount,
    onChangeAmount,
    onTokenPress,
    setFeeLoader,
    setBridgeFee,
    getSelectedTokenBalance,
    onPressPreview,
    withdraw
  };
  return {
    variables,
    methods
  };
};
