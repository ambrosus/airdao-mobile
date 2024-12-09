import React from 'react';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface ContentItemModel {
  title: string;
  value: string;
  isApy?: boolean;
}

export const ContentItem = ({
  title,
  value,
  isApy = false
}: ContentItemModel) => {
  return (
    <Row justifyContent="space-between">
      <Text fontSize={14} color={COLORS.neutral600}>
        {title}
      </Text>
      <Text fontSize={14} color={COLORS[isApy ? 'success300' : 'neutral800']}>
        {value}
      </Text>
    </Row>
  );
};
