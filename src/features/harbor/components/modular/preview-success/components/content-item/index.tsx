import React from 'react';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';
import { scale } from '@utils/scaling';

interface ContentItemModel {
  title: string;
  value: React.JSX.Element;
}

export const ContentItem = ({ title, value }: ContentItemModel) => {
  return (
    <Row style={{ marginBottom: scale(8) }} justifyContent="space-between">
      <Text fontSize={14} color={COLORS.neutral600}>
        {title}
      </Text>
      <Text>{value}</Text>
    </Row>
  );
};
