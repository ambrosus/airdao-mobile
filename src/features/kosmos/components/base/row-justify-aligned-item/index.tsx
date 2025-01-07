import React, { ReactNode } from 'react';
import { Row, Text } from '@components/base';
import { COLORS } from '@constants/colors';

interface RowJustifyAlignedItemProps {
  label: string;
  children: ReactNode;
}

export const RowJustifyAlignedItem = ({
  label,
  children
}: RowJustifyAlignedItemProps) => {
  return (
    <Row alignItems="center" justifyContent="space-between">
      <Text
        fontSize={15}
        fontFamily="Inter_500Medium"
        color={COLORS.neutral500}
      >
        {label}
      </Text>

      {children}
    </Row>
  );
};
