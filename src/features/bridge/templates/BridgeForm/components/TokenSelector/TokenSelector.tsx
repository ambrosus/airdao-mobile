import { Button, Row, Text } from '@components/base';
import { styles } from './TokenSelector.styles';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { ChevronDownIcon } from '@components/svg/icons';
import React from 'react';

interface TokenSelectorModel {
  onPress: () => void | undefined;
  symbol: string;
}

const TokenSelector = ({ onPress, symbol }: TokenSelectorModel) => (
  <Button onPress={onPress}>
    <Row style={styles.currencySelectorGap} alignItems="center">
      <TokenLogo scale={0.7} token={symbol} />
      <Row style={styles.currencySelectorInnerGap} alignItems="center">
        <Text
          fontSize={16}
          fontFamily="Inter_500Medium"
          color={COLORS.alphaBlack60}
        >
          {symbol}
        </Text>
        <ChevronDownIcon scale={0.45} color={COLORS.alphaBlack60} />
      </Row>
    </Row>
  </Button>
);
export default TokenSelector;
