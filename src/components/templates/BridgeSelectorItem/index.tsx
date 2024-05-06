import React from 'react';
import { Text } from 'react-native';
import { Button } from '@components/base';
import { ParsedBridge } from '@models/Bridge';

interface BridgeSelectorItemModel {
  bridge: ParsedBridge;
  onPressItem: (bridge: ParsedBridge) => void;
}

export const BridgeSelectorItem = ({
  bridge,
  onPressItem
}: BridgeSelectorItemModel) => {
  const { name } = bridge;
  return (
    <Button onPress={() => onPressItem(bridge)}>
      <Text>{name}</Text>
    </Button>
  );
};
