import { LayoutChangeEvent } from 'react-native';
import { RefObject, useMemo, useState } from 'react';
import { styles } from '@components/modular/Bridge/BridgeForm/styles';
import { API } from '@api/api';
import { formatEther } from 'ethers/lib/utils';
import { NumberUtils } from '@utils/number';
import { RenderTokenItem } from '@models/Bridge';
import { CurrencyUtils } from '@utils/currency';
import { StringUtils } from '@utils/string';
import { useBridgeContextSelector } from '@contexts/Bridge';
import { useTranslation } from 'react-i18next';
import { BridgeFeeModel } from '@components/modular/Bridge/BridgeForm/BridgeForm';
import { BottomSheetRef } from '@components/composite';

interface UseBridgeNetworksDataModel {
  choseTokenRef: RefObject<BottomSheetRef>;
}

const DECIMAL_CRYPTO_LIMIT = 5;
const DECIMAL_USD_LIMIT = 2;

export const useBridgeNetworksData = ({
  choseTokenRef
}: UseBridgeNetworksDataModel) => {
  const { tokenParams, bridgeConfig } = useBridgeContextSelector();
  const [currencySelectorWidth, setCurrencySelectorWidth] = useState<number>(0);
  const [isMax, setMax] = useState(false);
  const [amountToExchange, setAmountToExchange] = useState('');
  const [bridgeFee, setBridgeFee] = useState<BridgeFeeModel | null>(null);
  const [feeLoader, setFeeLoader] = useState(false);

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
    setAmountToExchange('999');

    if (tokenParams.value.renderTokenItem.isNativeCoin) {
      setMax(true);
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
      const fee = await API.bridgeService.bridgeSDK.getFeeData({
        bridgeConfig,
        dataForFee
      });
      setBridgeFee({
        amount: formatEther(fee.amount._hex),
        feeSymbol: fee.feeSymbol.toUpperCase(),
        networkFee: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.transferFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        ),
        bridgeAmount: NumberUtils.limitDecimalCount(
          Number(formatEther(fee.bridgeFee._hex)),
          DECIMAL_CRYPTO_LIMIT
        )
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

  const variables = {
    dataToPreview,
    amountToExchange,
    inputStyles,
    feeLoader,
    bridgeFee
  };
  const methods = {
    getFeeData,
    onCurrencySelectorLayoutHandle,
    onSelectMaxAmount,
    onChangeAmount,
    onTokenPress,
    setFeeLoader,
    setBridgeFee
  };
  return {
    variables,
    methods
  };
};
