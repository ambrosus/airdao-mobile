import React from 'react';
import { Text, View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { scale } from '@utils/scaling';
import { TokenLogo } from '@components/modular';
import { CheckIconCircle } from '@components/svg/icons';
import { styles } from './styles';

interface BridgeSelectorItemModel {
  name: string;
  symbol: string;
  item: ParsedBridge | RenderTokenItem;
  isActive: boolean;
  onPressItem: (item: any) => void;
  // onPressItem: (item: unknown) => void;
}

export const BridgeSelectorItem = ({
  symbol,
  item,
  onPressItem,
  isActive,
  name
}: BridgeSelectorItemModel) => {
  return (
    <Button style={styles.mainButton} onPress={() => onPressItem(item)}>
      <View style={styles.container}>
        <TokenLogo
          overrideIconVariants={{ eth: 'blue' }}
          token={symbol}
          scale={0.8}
        />
        <Spacer horizontal value={scale(10)} />
        <Text style={styles.text}>{name}</Text>
      </View>
      {isActive && <CheckIconCircle />}
    </Button>
  );
};
