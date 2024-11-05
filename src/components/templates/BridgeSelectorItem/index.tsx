import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Button, Spacer, Text } from '@components/base';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { scale } from '@utils/scaling';
import { TokenLogo } from '@components/modular';
import { styles } from './styles';
import { CryptoCurrencyCode } from '@appTypes';

interface BridgeSelectorItemModel {
  name: string;
  symbol: CryptoCurrencyCode | undefined;
  item: ParsedBridge | RenderTokenItem;
  isActive: boolean;
  onPressItem: (item: any) => void;
  tokenSymbol?: string;
}

export const BridgeSelectorItem = ({
  symbol,
  item,
  onPressItem,
  isActive,
  name
}: BridgeSelectorItemModel) => {
  const mainButtonStyle = useMemo(() => {
    if (isActive) {
      return { ...styles.mainButton, ...styles.mainSelectedButton };
    }
    return styles.mainButton;
  }, [isActive]);

  return (
    <Button style={mainButtonStyle} onPress={() => onPressItem(item)}>
      <View style={styles.container}>
        <TokenLogo
          overrideIconVariants={{ eth: 'blue' }}
          token={symbol || CryptoCurrencyCode.AMB}
          scale={1.2}
        />
        <Spacer horizontal value={scale(10)} />
        <View>
          <Text style={styles.textTop}>{symbol?.toUpperCase()}</Text>
          <Text style={styles.textBottom}>{name}</Text>
        </View>
      </View>
    </Button>
  );
};
