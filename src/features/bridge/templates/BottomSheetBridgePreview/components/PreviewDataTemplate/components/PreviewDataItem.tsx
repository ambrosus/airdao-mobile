import React from 'react';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { DataToPreviewModel } from '@models/Bridge';
import { NumberUtils, scale } from '@utils';
import { formatUnits } from 'ethers/lib/utils';

interface PreviewDataItemProps {
  item: {
    name?: string;
    index: number;
    item: DataToPreviewModel;
  };
}

export const PreviewDataItem = ({ item }: PreviewDataItemProps) => {
  const {
    index,
    item: {
      name,
      symbol,
      crypto: { amount, decimals }
    }
  } = item;

  const amountToRender = NumberUtils.limitDecimalCount(
    formatUnits(amount, decimals),
    5
  );

  const isFirst = index === 0;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Text>{name}</Text>
        <Row>
          {isFirst && <TokenLogo token={symbol} scale={0.5} />}
          <Spacer horizontal value={10} />
          <Text
            color={COLORS.neutral800}
          >{`${amountToRender}  ${symbol}`}</Text>
        </Row>
      </View>
      <Spacer value={scale(16)} />
    </>
  );
};
