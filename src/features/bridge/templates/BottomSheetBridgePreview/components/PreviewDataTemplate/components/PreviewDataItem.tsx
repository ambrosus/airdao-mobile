import { NumberUtils } from '@utils/number';
import { formatUnits } from 'ethers/lib/utils';
import { View } from 'react-native';
import { Row, Spacer, Text } from '@components/base';
import { TokenLogo } from '@components/modular';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';
import React from 'react';
import { DataToPreviewModel } from '@models/Bridge';

export const PreviewDataItem = ({
  item
}: {
  item: {
    name?: string;
    index: number;
    item: DataToPreviewModel;
  };
}) => {
  const { item: renderItem, index } = item;

  const amountToRender = NumberUtils.limitDecimalCount(
    formatUnits(renderItem.crypto.amount, renderItem.crypto.decimals),
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
        <Text>{renderItem.name}</Text>
        <Row>
          {isFirst && <TokenLogo token={renderItem.symbol} scale={0.5} />}
          <Spacer horizontal value={10} />
          <Text
            color={COLORS.neutral800}
          >{`${amountToRender}  ${renderItem.symbol}`}</Text>
        </Row>
      </View>
      <Spacer value={scale(16)} />
    </>
  );
};
