import { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { CryptoCurrencyCode } from '@appTypes';
import { Button, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { ParsedBridge, RenderTokenItem } from '@models/Bridge';
import { scale } from '@utils';
import { styles } from './styles';

interface BridgeSelectorItemModel {
  name: string;
  symbol: CryptoCurrencyCode | undefined;
  item: ParsedBridge | RenderTokenItem;
  rightContent?: ReactNode;
  isActive: boolean;
  onPressItem: (item: ParsedBridge | RenderTokenItem) => void;
}

export const BridgeSelectorItem = ({
  symbol,
  item,
  onPressItem,
  rightContent,
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
      {rightContent}
    </Button>
  );
};
