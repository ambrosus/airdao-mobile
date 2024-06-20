import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { FIELD } from '@features/swap/types';
import { COLORS } from '@constants/colors';

export const PreviewInformation = () => {
  const {
    selectedTokens,

    isExactInRef,
    uiBottomSheetInformation
  } = useSwapContextSelector();

  const tokensSymbols = useMemo(() => {
    const sellTokenSymbol =
      selectedTokens[isExactInRef.current ? FIELD.TOKEN_A : FIELD.TOKEN_B]
        ?.symbol ?? '';

    const receiveTokenSymbol =
      selectedTokens[isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A]
        ?.symbol ?? '';

    return { sellTokenSymbol, receiveTokenSymbol };
  }, [isExactInRef, selectedTokens]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Text>Minimum received</Text>

        <RightSideRowItem>
          {`${uiBottomSheetInformation.minimumReceivedAmount} ${tokensSymbols.receiveTokenSymbol}`}
        </RightSideRowItem>
      </Row>

      <Row alignItems="center" justifyContent="space-between">
        <Text>Price Impact</Text>

        <RightSideRowItem>
          {uiBottomSheetInformation.priceImpact}%
        </RightSideRowItem>
      </Row>

      <Row alignItems="center" justifyContent="space-between">
        <Text>Liquidity Provider Fee</Text>

        <RightSideRowItem>
          {`${uiBottomSheetInformation.lpFee} ${tokensSymbols.sellTokenSymbol}`}
        </RightSideRowItem>
      </Row>
    </View>
  );
};

const RightSideRowItem = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      fontSize={14}
      fontFamily="Inter_600SemiBold"
      color={COLORS.neutral800}
    >
      {children}
    </Text>
  );
};
