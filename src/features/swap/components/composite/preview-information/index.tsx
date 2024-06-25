import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { COLORS } from '@constants/colors';
import {
  isMultiRouteWithUSDCFirst,
  isMultiRouteWithBONDFirst
} from '@features/swap/utils';

export const PreviewInformation = () => {
  const { t } = useTranslation();
  const { latestSelectedTokens, isExactInRef, uiBottomSheetInformation } =
    useSwapContextSelector();

  const isMultiHopSwap = useMemo(() => {
    const { TOKEN_A, TOKEN_B } = latestSelectedTokens.current;

    const isMuliRouteUSDCSwap = isMultiRouteWithUSDCFirst.has(
      [TOKEN_A?.address, TOKEN_B?.address].join()
    );

    const isMuliRouteBONDSwap = isMultiRouteWithBONDFirst.has(
      [TOKEN_A?.address, TOKEN_B?.address].join()
    );

    return (
      (isExactInRef.current && isMuliRouteUSDCSwap) ||
      (!isExactInRef.current && isMuliRouteBONDSwap)
    );
  }, [isExactInRef, latestSelectedTokens]);

  const tokensSymbols = useMemo(() => {
    const sellTokenSymbol =
      latestSelectedTokens.current[
        isExactInRef.current ? FIELD.TOKEN_A : FIELD.TOKEN_B
      ]?.symbol ?? '';

    const receiveTokenSymbol =
      latestSelectedTokens.current[
        isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A
      ]?.symbol ?? '';

    return { sellTokenSymbol, receiveTokenSymbol };
  }, [isExactInRef, latestSelectedTokens]);

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

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Text>{t('swap.bottom.sheet.min.received')}</Text>

        <RightSideRowItem>
          {`${uiBottomSheetInformation.minimumReceivedAmount} ${tokensSymbols.receiveTokenSymbol}`}
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
          {`${uiBottomSheetInformation.lpFee} ${tokensSymbols.sellTokenSymbol}`}
        </RightSideRowItem>
      </Row>

      {isMultiHopSwap && (
        <Row alignItems="center" justifyContent="space-between">
          <Text>{t('swap.route')}</Text>

          <RightSideRowItem>
            {`${latestSelectedTokens.current.TOKEN_A?.symbol} > SAMB > ${latestSelectedTokens.current.TOKEN_B?.symbol}`}
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
