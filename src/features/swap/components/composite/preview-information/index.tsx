import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { Row, Text } from '@components/base';
import { useSwapContextSelector } from '@features/swap/context';
import { SwapStringUtils, minimumAmountOut } from '@features/swap/utils';
import { ethers } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { FIELD } from '@features/swap/types';
import { COLORS } from '@constants/colors';

export const PreviewInformation = () => {
  const {
    selectedTokensAmount,
    selectedTokens,
    slippageTolerance,
    isExactInRef
  } = useSwapContextSelector();

  const receiveTokensKey = useMemo(() => {
    return isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A;
  }, [isExactInRef]);

  const minimumReceivedTokens = useMemo(() => {
    const bnAmountToReceive = ethers.utils.parseUnits(
      selectedTokensAmount[receiveTokensKey] ?? '0'
    );

    const bnMinimumReceived = minimumAmountOut(
      slippageTolerance,
      bnAmountToReceive
    );

    const symbol =
      selectedTokens[isExactInRef.current ? FIELD.TOKEN_B : FIELD.TOKEN_A]
        ?.symbol ?? '';

    const transformedAmount = SwapStringUtils.transformAmountValue(
      formatEther(bnMinimumReceived._hex)
    );

    return `${transformedAmount} ${symbol}`;
  }, [
    selectedTokensAmount,
    receiveTokensKey,
    selectedTokens,
    isExactInRef,
    slippageTolerance
  ]);

  return (
    <View style={styles.container}>
      <Row alignItems="center" justifyContent="space-between">
        <Text>Minimum received</Text>

        <RightSideRowItem>{minimumReceivedTokens}</RightSideRowItem>
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
