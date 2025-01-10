import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { useSwapContextSelector } from '@features/swap/context';
import { useSwapTokens } from '@features/swap/lib/hooks';
import { addresses } from '@features/swap/utils';
import { getObjectKeyByValue } from '@utils';
import { styles } from './styles';

export const PreviewInformation = () => {
  const { t } = useTranslation();
  const {
    latestSelectedTokens,
    uiBottomSheetInformation,
    _refExactGetter,
    isMultiHopSwapBetterCurrency
  } = useSwapContextSelector();

  const { tokenToSell, tokenToReceive } = useSwapTokens();

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
    return isMultiHopSwapBetterCurrency.state;
  }, [isMultiHopSwapBetterCurrency]);

  const tokens = useMemo(() => {
    return isMultiHopSwapBetterCurrency.tokens.map((token) =>
      getObjectKeyByValue(addresses, token)
    );
  }, [isMultiHopSwapBetterCurrency.tokens]);

  const renderHopTokensRoute = useMemo(() => {
    return tokens.length > 0 ? tokens.join(' > ') : '';
  }, [tokens]);

  return (
    <View style={styles.container}>
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

      <Row alignItems="center" justifyContent="space-between">
        <Text
          fontSize={15}
          fontFamily="Inter_500Medium"
          color={COLORS.neutral500}
        >
          {t('swap.bottom.sheet.lpfee')}
        </Text>

        <RightSideRowItem>
          {`${uiBottomSheetInformation.lpFee} ${tokenToSell.TOKEN?.symbol}`}
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
            {`${latestSelectedTokens.current.TOKEN_A?.symbol} > ${renderHopTokensRoute} ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
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
