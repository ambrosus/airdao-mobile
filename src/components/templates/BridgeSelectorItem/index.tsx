import React from 'react';
import { Text, View } from 'react-native';
import { Button, Spacer } from '@components/base';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { scale } from '@utils/scaling';
import { TokenLogo } from '@components/modular';
import { CheckIconCircle } from '@components/svg/icons';
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
  name,
  tokenSymbol
}: BridgeSelectorItemModel) => {
  return (
    <Button style={styles.mainButton} onPress={() => onPressItem(item)}>
      <View style={styles.container}>
        <TokenLogo
          overrideIconVariants={{ eth: 'blue' }}
          token={symbol || CryptoCurrencyCode.AMB}
          scale={0.8}
        />
        <Spacer horizontal value={scale(10)} />
        {!!tokenSymbol && (
          <>
            <Text style={styles.boldText}>{tokenSymbol}</Text>
            <Spacer value={5} horizontal />
          </>
        )}
        <Text style={styles.text}>{name}</Text>
      </View>
      {isActive && <CheckIconCircle />}
    </Button>
  );
};
