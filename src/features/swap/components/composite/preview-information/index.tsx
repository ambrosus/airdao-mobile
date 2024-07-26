import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { COLORS } from '@constants/colors';
import { useSwapHelpers, useSwapTokens } from '@features/swap/lib/hooks';

export const PreviewInformation = () => {
  const { t } = useTranslation();
  const { latestSelectedTokens, uiBottomSheetInformation, _refExactGetter } =
    useSwapContextSelector();

  const { tokenToSell, tokenToReceive } = useSwapTokens();
  const { isMultiHopSwap } = useSwapHelpers();

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

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Text>
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
        <Text>{t('swap.bottom.sheet.impact')}</Text>

        <RightSideRowItem color={priceImpactHighlight}>
          {uiPriceImpact}%
        </RightSideRowItem>
      </Row>

      <Row alignItems="center" justifyContent="space-between">
        <Text>{t('swap.bottom.sheet.lpfee')}</Text>

        <RightSideRowItem>
          {`${uiBottomSheetInformation.lpFee} ${tokenToSell.TOKEN?.symbol}`}
        </RightSideRowItem>
      </Row>

      {isMultiHopSwap && (
        <Row alignItems="center" justifyContent="space-between">
          <Text>{t('swap.route')}</Text>

          <RightSideRowItem>
            {`${latestSelectedTokens.current.TOKEN_A?.symbol} > AMB > ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
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
    <Text fontSize={14} fontFamily="Inter_600SemiBold" color={color}>
      {children}
    </Text>
  );
};
