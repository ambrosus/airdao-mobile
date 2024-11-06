import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { SwapIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, verticalScale } from '@utils/scaling';
import { NumberUtils } from '@utils/number';

interface ShowInUSDProps {
  usdAmount: number;
  cryptoAmount: number;
  showInUSD: boolean;
  cryptoSymbol: string;
  cryptoSymbolPlacement?: 'left' | 'right';
}

export const ShowInUSD = (props: ShowInUSDProps) => {
  const {
    usdAmount,
    cryptoAmount,
    showInUSD,
    cryptoSymbol,
    cryptoSymbolPlacement = 'left'
  } = props;
  const amount = NumberUtils.formatNumber(
    showInUSD ? usdAmount : cryptoAmount,
    3
  );
  const symbol = showInUSD ? '$' : cryptoSymbol;
  return (
    <Row alignItems="center" style={styles.container}>
      <Text>
        {showInUSD || cryptoSymbolPlacement === 'left'
          ? `${symbol}${amount}`
          : `${amount} ${symbol}`}
      </Text>
      <Spacer value={scale(4)} horizontal />
      <View style={{ transform: [{ rotate: '90deg' }] }}>
        <SwapIcon color={COLORS.brand600} scale={0.75} />
      </View>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.alphaBlack5,
    paddingLeft: scale(12),
    paddingRight: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: 1000,
    alignSelf: 'center'
  }
});
