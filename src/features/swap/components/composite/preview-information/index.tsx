import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import { CryptoCurrencyCode } from '@appTypes';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapTokens } from '@features/swap/lib/hooks';
import {
  addresses,
  isETHtoWrapped,
  isWrappedToETH,
  SwapStringUtils
} from '@features/swap/utils';
import { getObjectKeyByValue, NumberUtils } from '@utils';
import { styles } from './styles';

export const PreviewInformation = () => {
  const { t } = useTranslation();
  const {
    latestSelectedTokens,
    uiBottomSheetInformation,
    _refExactGetter,
    isMultiHopSwapBetterCurrency,
    estimatedGasValues
  } = useSwapContextSelector();

  const { tokensRoute, tokenToSell, tokenToReceive } = useSwapTokens();

  const uiPriceImpact = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;

    return priceImpact != null && priceImpact < 0.01 ? '<0.01' : priceImpact;
  }, [uiBottomSheetInformation]);

  const priceImpactHighlight = useMemo(() => {
    const { priceImpact } = uiBottomSheetInformation;

    if (priceImpact !== undefined && priceImpact !== null) {
      if (priceImpact < 0 || priceImpact < 5) return COLORS.success500;
      if (priceImpact >= 5) return COLORS.error500;
    }
  }, [uiBottomSheetInformation]);

  const symbol = useMemo(() => {
    return _refExactGetter
      ? tokenToReceive.TOKEN?.symbol
      : tokenToSell.TOKEN?.symbol;
  }, [
    _refExactGetter,
    tokenToReceive.TOKEN?.symbol,
    tokenToSell.TOKEN?.symbol
  ]);

  const isMultiHopRoute = useMemo(() => {
    return isMultiHopSwapBetterCurrency.tokens.length > 0;
  }, [isMultiHopSwapBetterCurrency]);

  const tokens = useMemo(() => {
    return isMultiHopSwapBetterCurrency.tokens.map((token) =>
      getObjectKeyByValue(addresses, token)
    );
  }, [isMultiHopSwapBetterCurrency.tokens]);

  const renderHopTokensRoute = useMemo(() => {
    return tokens.length > 0 ? tokens.join(' > ') : '';
  }, [tokens]);

  const estimatedNetworkFee = useMemo(() => {
    const { swap, approval } = estimatedGasValues;

    const parsedEstimatedGas = ethers.utils.formatEther(swap.add(approval));

    return SwapStringUtils.transformRealizedLPFee(
      NumberUtils.limitDecimalCount(parsedEstimatedGas, 1)
    );
  }, [estimatedGasValues]);

  const isWrapOrUnwrapETH = useMemo(() => {
    return isETHtoWrapped(tokensRoute) || isWrappedToETH(tokensRoute);
  }, [tokensRoute]);

  return (
    <View style={styles.container}>
      {!isWrapOrUnwrapETH && (
        <>
          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={15}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral500}
            >
              {t(
                !_refExactGetter
                  ? 'swap.bottom.sheet.max.sold'
                  : 'swap.bottom.sheet.min.received'
              )}
            </Text>

            <RightSideRowItem>
              {`${uiBottomSheetInformation.minimumReceivedAmount} ${symbol}`}
            </RightSideRowItem>
          </Row>

          <Row alignItems="center" justifyContent="space-between">
            <Text
              fontSize={15}
              fontFamily="Inter_500Medium"
              color={COLORS.neutral500}
            >
              {t('swap.bottom.sheet.impact')}
            </Text>

            <RightSideRowItem color={priceImpactHighlight}>
              {uiPriceImpact}%
            </RightSideRowItem>
          </Row>
        </>
      )}

      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={15}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          {t('swap.bottom.sheet.lpfee')}
        </Text>

        <RightSideRowItem>
          {`${estimatedNetworkFee} ${CryptoCurrencyCode.ASC}`}
        </RightSideRowItem>
      </Row>

      {isMultiHopRoute && (
        <Row alignItems="center" justifyContent="space-between">
          <Text
            fontSize={15}
            fontFamily="Inter_500Medium"
            color={COLORS.neutral500}
          >
            {t('swap.route')}
          </Text>

          <RightSideRowItem>
            {`${latestSelectedTokens.current.TOKEN_A?.symbol} > ${renderHopTokensRoute} > ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
          </RightSideRowItem>
        </Row>
      )}
    </View>
  );
};

const RightSideRowItem = ({
  children,
  color = COLORS.neutral800
}: {
  children: ReactNode;
  color?: string;
}) => {
  return (
    <Text fontSize={15} fontFamily="Inter_500Medium" color={color}>
      {children}
    </Text>
  );
};
