import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { SwapIcon } from '@components/svg/icons';
import { COLORS } from '@constants/colors';
import { scale, NumberUtils } from '@utils';
import { styles } from './styles';

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
